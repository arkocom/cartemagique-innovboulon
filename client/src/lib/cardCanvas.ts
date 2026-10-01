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
  shadowEnabled?: boolean;
  outlineEnabled?: boolean;
  outlineWidth?: number;
  outlineColor?: string;
}

export interface CardCanvasTextStyle {
  name: string;
  fontFamily: string;
  fontWeight?: string;
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

export type CardCanvasAssetType = 'background' | 'photo';

export class CardCanvasAssetError extends Error {
  readonly assetType: CardCanvasAssetType;
  readonly assetIndex?: number;

  constructor(assetType: CardCanvasAssetType, assetIndex?: number) {
    const message = assetType === 'background'
      ? 'Impossible de charger le fond de la carte. Vérifiez la connexion ou choisissez un autre fond avant l’export.'
      : `Impossible de charger la photo n°${assetIndex ?? 1}. Vérifiez la connexion ou retirez-la avant l’export.`;
    super(message);
    this.name = 'CardCanvasAssetError';
    this.assetType = assetType;
    this.assetIndex = assetIndex;
  }
}

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

const TEXT_SAFE_MARGIN = 16;

function wrapTextToWidth(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];

  for (const paragraph of text.split('\n')) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }

    let currentLine = '';
    for (const word of paragraph.trim().split(/\s+/)) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (context.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }

      if (context.measureText(word).width <= maxWidth) {
        currentLine = word;
        continue;
      }

      let chunk = '';
      for (const character of word) {
        const nextChunk = chunk + character;
        if (chunk && context.measureText(nextChunk).width > maxWidth) {
          lines.push(chunk);
          chunk = character;
        } else {
          chunk = nextChunk;
        }
      }
      currentLine = chunk;
    }

    lines.push(currentLine);
  }

  return lines.length ? lines : [''];
}

function clampTextAnchorX(
  align: 'left' | 'center' | 'right',
  desiredX: number,
  widestLine: number,
  canvasWidth: number,
  inset: number,
): number {
  if (align === 'left') {
    return Math.min(Math.max(desiredX, inset), canvasWidth - inset - widestLine);
  }
  if (align === 'right') {
    return Math.min(Math.max(desiredX, inset + widestLine), canvasWidth - inset);
  }

  const halfWidth = widestLine / 2;
  return Math.min(
    Math.max(desiredX, inset + halfWidth),
    canvasWidth - inset - halfWidth,
  );
}

export function getCardTextBounds(
  context: CanvasRenderingContext2D,
  block: CardCanvasTextBlock,
  style: CardCanvasTextStyle,
  canvasWidth: number,
  showFrame: boolean,
  frameWidth: number,
): { left: number; right: number; top: number; bottom: number } {
  context.font = `${style.fontWeight ?? 'bold'} ${block.fontSize}px ${style.fontFamily}`;
  const inset = Math.max(TEXT_SAFE_MARGIN, showFrame ? frameWidth + 8 : TEXT_SAFE_MARGIN);
  const maxTextWidth = Math.max(40, canvasWidth - inset * 2);
  const lines = wrapTextToWidth(context, block.text, maxTextWidth);
  const widestLine = Math.min(
    maxTextWidth,
    Math.max(0, ...lines.map((line) => context.measureText(line).width)),
  );
  const align = block.align || 'center';
  const anchorX = clampTextAnchorX(align, block.x, widestLine, canvasWidth, inset);
  const left = align === 'left'
    ? anchorX
    : align === 'right'
      ? anchorX - widestLine
      : anchorX - widestLine / 2;
  const lineHeight = block.fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const padding = Math.max(
    6,
    style.outline ? (style.outlineWidth || 0) / 2 : 0,
    Math.min(style.shadowBlur || 0, 16),
  );

  return { left: left - padding, right: left + widestLine + padding, top: block.y - totalHeight / 2 - padding, bottom: block.y + totalHeight / 2 + padding };
}

export function isPointInsideCardTextBlock(
  context: CanvasRenderingContext2D, block: CardCanvasTextBlock, style: CardCanvasTextStyle,
  x: number, y: number, canvasWidth: number, showFrame: boolean, frameWidth: number,
): boolean {
  const bounds = getCardTextBounds(context, block, style, canvasWidth, showFrame, frameWidth);
  return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}

async function loadRequiredCanvasImage(
  src: string,
  loadImage: CanvasImageLoader,
  assetType: CardCanvasAssetType,
  assetIndex?: number,
): Promise<HTMLImageElement> {
  try {
    if (!src) throw new Error('Image source is empty');
    const image = await loadImage(src);
    if (!(image.width > 0) || !(image.height > 0)) throw new Error('Image has no dimensions');
    return image;
  } catch {
    throw new CardCanvasAssetError(assetType, assetIndex);
  }
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

  // Canvas does not wait for web fonts: load before measuring, previewing or exporting.
  if (typeof document !== 'undefined' && document.fonts?.load) {
    await Promise.all(options.textBlocks.map((block) => {
      const style = options.textStyles[block.style] ?? DEFAULT_TEXT_STYLE;
      return document.fonts.load(`${style.fontWeight ?? 'bold'} ${block.fontSize}px ${style.fontFamily}`, block.text || 'Bonjour');
    }));
  }
  const { width, height } = getCardCanvasSize(options.aspectRatio);
  const backgroundPromise = options.backgroundColor
    ? Promise.resolve(null)
    : loadRequiredCanvasImage(options.backgroundImage, loadImage, 'background');
  const [background, ...loadedElements] = await Promise.all([
    backgroundPromise,
    ...options.imageElements.map((element, index) =>
      loadRequiredCanvasImage(element.src, loadImage, 'photo', index + 1),
    ),
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
    context.font = `${style.fontWeight ?? 'bold'} ${block.fontSize}px ${style.fontFamily}`;
    context.fillStyle = block.color;
    const align = block.align || 'center';
    context.textAlign = align;
    context.textBaseline = 'middle';
    const hasShadow = (block.shadowEnabled ?? style.shadowBlur > 0);
    context.shadowColor = hasShadow ? (style.shadowColor === 'transparent' ? 'rgba(0,0,0,0.6)' : style.shadowColor) : 'transparent';
    context.shadowBlur = hasShadow ? (style.shadowBlur || 8) : 0;
    context.shadowOffsetX = hasShadow ? 2 : 0;
    context.shadowOffsetY = hasShadow ? 2 : 0;

    const safeInset = Math.max(
      TEXT_SAFE_MARGIN,
      options.showFrame ? options.frameWidth + 8 : TEXT_SAFE_MARGIN,
    );
    const maxTextWidth = Math.max(40, width - safeInset * 2);
    const lines = wrapTextToWidth(context, block.text, maxTextWidth);
    const lineWidths = lines.map((line) => context.measureText(line).width);
    const widestLine = Math.min(maxTextWidth, Math.max(0, ...lineWidths));
    const drawX = clampTextAnchorX(align, block.x, widestLine, width, safeInset);
    const lineHeight = block.fontSize * 1.2;
    const startY = block.y - (lines.length * lineHeight) / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      const lineY = startY + index * lineHeight;
      if (block.outlineEnabled ?? style.outline) {
        context.strokeStyle = block.outlineColor ?? style.outlineColor ?? '#000000';
        context.lineWidth = block.outlineWidth ?? (style.outlineWidth || 2);
        context.lineJoin = 'round';
        context.miterLimit = 2;
        context.strokeText(line, drawX, lineY);
      }
      context.fillText(line, drawX, lineY);
    });
    context.restore();
  });

  return true;
}

