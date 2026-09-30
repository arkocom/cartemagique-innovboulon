export type CardAspectRatio = 'standard' | 'story';

export interface CardCanvasSize {
  width: number;
  height: number;
}

export interface CardCanvasImageElement {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  filter?: 'none' | 'grayscale' | 'sepia' | 'vintage';
  tint?: string;
}

export interface CardCanvasTextBlock {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  style: string;
  align: 'left' | 'center' | 'right';
}

export interface CardCanvasTextStyle {
  name: string;
  fontFamily: string;
  shadowBlur: number;
  shadowColor: string;
  outline: boolean;
  outlineWidth: number;
  outlineColor: string;
}

export interface CardCanvasRenderOptions {
  aspectRatio: CardAspectRatio;
  backgroundColor: string;
  backgroundImage: string;
  imageElements: CardCanvasImageElement[];
  textBlocks: CardCanvasTextBlock[];
  textStyles: Record<string, CardCanvasTextStyle>;
  showFrame: boolean;
  frameWidth: number;
}

export type CanvasImageLoader = (src: string) => Promise<HTMLImageElement>;

const DEFAULT_TEXT_STYLE: CardCanvasTextStyle = {
  name: 'Moderne',
  fontFamily: 'Arial, sans-serif',
  shadowBlur: 15,
  shadowColor: 'rgba(0, 0, 0, 0.9)',
  outline: true,
  outlineWidth: 3,
  outlineColor: '#000000',
};

export function getCardCanvasSize(aspectRatio: CardAspectRatio): CardCanvasSize {
  return { width: aspectRatio === 'story' ? 338 : 400, height: 600 };
}

/**
 * Draws one immutable editor snapshot to the provided canvas. Returning false
 * means a newer preview render superseded this one before any pixels were drawn.
 */
export async function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  options: CardCanvasRenderOptions,
  loadImage: CanvasImageLoader,
  isCurrent: () => boolean = () => true,
): Promise<boolean> {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Le contexte graphique 2D est indisponible.');

  const { width, height } = getCardCanvasSize(options.aspectRatio);
  const [background, ...loadedElements] = await Promise.all([
    options.backgroundColor || !options.backgroundImage
      ? Promise.resolve(null)
      : loadImage(options.backgroundImage).catch(() => null),
    ...options.imageElements.map((element) => loadImage(element.src).catch(() => null)),
  ]);

  if (!isCurrent()) return false;

  context.clearRect(0, 0, width, height);
  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, width, height);
  } else if (background) {
    const scale = Math.max(width / background.width, height / background.height);
    const x = width / 2 - (background.width * scale) / 2;
    const y = height / 2 - (background.height * scale) / 2;
    context.drawImage(background, x, y, background.width * scale, background.height * scale);
  }

  options.imageElements.forEach((element, index) => {
    const image = loadedElements[index];
    if (!image) return;

    context.save();
    context.translate(element.x + element.width / 2, element.y + element.height / 2);
    context.rotate((element.rotation * Math.PI) / 180);

    if (element.filter === 'grayscale') context.filter = 'grayscale(100%)';
    if (element.filter === 'sepia') context.filter = 'sepia(100%)';
    if (element.filter === 'vintage') context.filter = 'sepia(50%) contrast(120%) brightness(90%)';

    if (element.tint && element.tint !== 'original') {
      const tintCanvas = document.createElement('canvas');
      tintCanvas.width = image.width;
      tintCanvas.height = image.height;
      const tintContext = tintCanvas.getContext('2d');
      if (tintContext) {
        tintContext.drawImage(image, 0, 0);
        tintContext.globalCompositeOperation = 'source-in';
        tintContext.fillStyle = element.tint;
        tintContext.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
        context.drawImage(tintCanvas, -element.width / 2, -element.height / 2, element.width, element.height);
      }
    } else {
      context.drawImage(image, -element.width / 2, -element.height / 2, element.width, element.height);
    }

    context.restore();
  });

  // The frame must remain visible over photos while text stays in the foreground.
  if (options.showFrame && options.frameWidth > 0) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, options.frameWidth, height);
    context.fillRect(width - options.frameWidth, 0, options.frameWidth, height);
    context.fillRect(0, 0, width, options.frameWidth);
    context.fillRect(0, height - options.frameWidth, width, options.frameWidth);
  }

  options.textBlocks.forEach((block) => {
    const style = options.textStyles[block.style] ?? options.textStyles.modern ?? DEFAULT_TEXT_STYLE;
    context.save();
    context.font = `bold ${block.fontSize}px ${style.fontFamily}`;
    context.fillStyle = block.color;
    context.textAlign = block.align || 'center';
    context.textBaseline = 'middle';
    context.shadowColor = style.shadowColor;
    context.shadowBlur = style.shadowBlur;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    const lines = block.text.split('\n');
    const lineHeight = block.fontSize * 1.2;
    const startY = block.y - (lines.length * lineHeight) / 2 + lineHeight / 2;
    lines.forEach((line, index) => {
      const lineY = startY + index * lineHeight;
      if (style.outline) {
        context.strokeStyle = style.outlineColor || '#000000';
        context.lineWidth = style.outlineWidth || 2;
        context.lineJoin = 'round';
        context.miterLimit = 2;
        context.strokeText(line, block.x, lineY);
      }
      context.fillText(line, block.x, lineY);
    });
    context.restore();
  });

  return true;
}
