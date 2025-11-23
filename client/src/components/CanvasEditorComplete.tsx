import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useAppStore } from '@/stores/appStore';
import { themes } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  draggable: boolean;
}

function BackgroundImage({ src }: { src: string }) {
  const [image] = useImage(src);
  return <KonvaImage image={image} width={800} height={1000} />;
}

function EditableText({
  textElement,
  isSelected,
  onSelect,
  onChange,
}: {
  textElement: TextElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<TextElement>) => void;
}) {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        {...textElement}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(5, node.fontSize() * scaleY),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}

export default function CanvasEditorComplete({ stageRef }: { stageRef: React.RefObject<any> }) {
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);
  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];

  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: '1',
      text: 'Joyeux Noël !',
      x: 200,
      y: 400,
      fontSize: 60,
      fontFamily: 'Arial',
      fill: '#ffffff',
      draggable: true,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [newText, setNewText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState([60]);
  // stageRef is now passed as prop

  const selectedElement = textElements.find((el) => el.id === selectedId);

  useEffect(() => {
    if (selectedElement) {
      setTextColor(selectedElement.fill);
      setFontSize([selectedElement.fontSize]);
    }
  }, [selectedId, selectedElement]);

  const handleAddText = () => {
    if (!newText.trim()) return;
    
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: newText,
      x: 100,
      y: 100,
      fontSize: 40,
      fontFamily: 'Arial',
      fill: '#ffffff',
      draggable: true,
    };
    
    setTextElements([...textElements, newElement]);
    setNewText('');
    setSelectedId(newElement.id);
  };

  const handleUpdateText = (id: string, newAttrs: Partial<TextElement>) => {
    setTextElements(
      textElements.map((el) =>
        el.id === id ? { ...el, ...newAttrs } : el
      )
    );
  };

  const handleDeleteText = () => {
    if (!selectedId) return;
    setTextElements(textElements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const handleColorChange = (color: string) => {
    if (!selectedId) return;
    setTextColor(color);
    handleUpdateText(selectedId, { fill: color });
  };

  const handleFontSizeChange = (value: number[]) => {
    if (!selectedId) return;
    setFontSize(value);
    handleUpdateText(selectedId, { fontSize: value[0] });
  };

  const handleTextContentChange = (newContent: string) => {
    if (!selectedId) return;
    handleUpdateText(selectedId, { text: newContent });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
            <div className="relative" style={{ width: '800px', height: '1000px', maxWidth: '100%', aspectRatio: '4/5' }}>
              <Stage
                ref={stageRef}
                width={800}
                height={1000}
                style={{ maxWidth: '100%', height: 'auto' }}
                onMouseDown={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty) {
                    setSelectedId(null);
                  }
                }}
                onTouchStart={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty) {
                    setSelectedId(null);
                  }
                }}
              >
                <Layer>
                  <BackgroundImage src={selectedTheme.image} />
                  {textElements.map((textEl) => (
                    <EditableText
                      key={textEl.id}
                      textElement={textEl}
                      isSelected={textEl.id === selectedId}
                      onSelect={() => setSelectedId(textEl.id)}
                      onChange={(newAttrs) => handleUpdateText(textEl.id, newAttrs)}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        {/* Panneau de contrôle */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-bold text-white">Ajouter du texte</h3>
            <div className="space-y-2">
              <Input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Votre message..."
                className="bg-gray-700 text-white border-gray-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddText();
                  }
                }}
              />
              <Button onClick={handleAddText} className="w-full">
                ➕ Ajouter
              </Button>
            </div>
          </div>

          {selectedElement && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-bold text-white">Personnaliser</h3>
              
              <div className="space-y-2">
                <Label className="text-white">Texte</Label>
                <Input
                  value={selectedElement.text}
                  onChange={(e) => handleTextContentChange(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Couleur</Label>
                <div className="flex gap-2">
                  {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          textColor === color ? 'border-white' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="bg-gray-700 border-gray-600 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Taille: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={handleFontSizeChange}
                  min={20}
                  max={120}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button onClick={handleDeleteText} variant="destructive" className="w-full">
                🗑️ Supprimer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
