import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Stage,
  Layer,
  Text as KonvaText,
  Image as KonvaImage,
  Transformer,
  Rect,
} from 'react-konva';
import useImage from 'use-image';
import { useAppStore } from '@/stores/appStore';
import { themes } from '@/lib/themes';

interface BackgroundLayerProps {
  themeId: string;
  width: number;
  height: number;
}

const BackgroundLayer = ({ themeId, width, height }: BackgroundLayerProps) => {
  const theme = themes.find((t) => t.id === themeId) || themes[0];
  const [image] = useImage(theme.image, 'anonymous');

  return (
    <>
      <Rect width={width} height={height} fill="#0f172a" />
      {image && (
        <KonvaImage
          image={image}
          width={width}
          height={height}
          listening={false}
        />
      )}
      <Rect
        width={width}
        height={height}
        fill="black"
        opacity={0.2}
        listening={false}
      />
    </>
  );
};

interface EditableTextProps {
  textProps: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: any) => void;
}

const EditableText = ({
  textProps,
  isSelected,
  onSelect,
  onChange,
}: EditableTextProps) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaText
        {...textProps}
        ref={shapeRef}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e: any) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            onChange({
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
            });
          }
        }}
        onDblClick={() => {
          const val = prompt('Modifier le texte :', textProps.content);
          if (val !== null) onChange({ content: val });
        }}
        shadowColor="rgba(0,0,0,0.5)"
        shadowBlur={10}
        shadowOffset={{ x: 2, y: 2 }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface CanvasEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CanvasEditor({ isOpen, onClose }: CanvasEditorProps) {
  const {
    selectedThemeId,
    elements,
    addElement,
    updateElement,
    selectedId,
    selectElement,
  } = useAppStore();
  const [stageSize, setStageSize] = useState({ width: 800, height: 1100 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.clientWidth, 800);
        const height = width * (11 / 8);
        setStageSize({ width, height });
      }
    };
    if (isOpen) {
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [isOpen]);

  const handleAddText = () => {
    addElement({
      id: `text-${Date.now()}`,
      type: 'text',
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      content: 'Double-cliquez pour éditer',
      fill: '#ffffff',
      fontSize: 32,
      fontFamily: 'Georgia, serif',
      align: 'center',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Barre d'outils */}
      <div className="h-16 flex items-center justify-between px-4 bg-slate-800/80 backdrop-blur">
        <h3 className="text-white font-bold">Éditeur</h3>
        <div className="flex gap-2">
          <button
            onClick={handleAddText}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium"
          >
            ✍️ Texte
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 flex items-center justify-center p-4"
        ref={containerRef}
      >
        <div
          className="shadow-2xl border border-white/10 rounded-xl overflow-hidden"
          style={{ maxWidth: 800, maxHeight: 1100 }}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                selectElement(null);
              }
            }}
          >
            <Layer>
              <BackgroundLayer
                themeId={selectedThemeId}
                width={stageSize.width}
                height={stageSize.height}
              />
              {elements.map(
                (el) =>
                  el.type === 'text' && (
                    <EditableText
                      key={el.id}
                      textProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => selectElement(el.id)}
                      onChange={(attrs: any) => updateElement(el.id, attrs)}
                    />
                  )
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </motion.div>
  );
}
