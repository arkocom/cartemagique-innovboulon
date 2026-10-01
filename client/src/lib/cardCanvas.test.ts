import { describe, expect, it, vi } from 'vitest';
import {
  getCardCanvasSize,
  isPointInsideCardTextBlock,
  renderCardToCanvas,
  type CardCanvasRenderOptions,
} from './cardCanvas';

function createMockCanvas() {
  const operations: string[] = [];
  const context = {
    fillStyle: '',
    filter: 'none',
    globalCompositeOperation: 'source-over',
    clearRect: vi.fn(() => operations.push('clear')),
    fillRect: vi.fn(function (this: { fillStyle: string }) {
      operations.push(`rect:${this.fillStyle}`);
    }),
    drawImage: vi.fn((image: { id?: string }) => operations.push(`image:${image.id ?? 'unknown'}`)),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
    strokeText: vi.fn((text: string) => operations.push(`stroke:${text}`)),
    fillText: vi.fn((text: string) => operations.push(`text:${text}`)),
  };
  const canvas = {
    getContext: vi.fn(() => context),
  } as unknown as HTMLCanvasElement;

  return { canvas, context, operations };
}

function createOptions(overrides: Partial<CardCanvasRenderOptions> = {}): CardCanvasRenderOptions {
  return {
    aspectRatio: 'standard',
    backgroundColor: '#101010',
    backgroundImage: '/background.png',
    imageElements: [],
    textBlocks: [],
    textStyles: {
      modern: {
        name: 'Moderne',
        fontFamily: 'Arial, sans-serif',
        shadowBlur: 15,
        shadowColor: '#000000',
        outline: false,
        outlineWidth: 0,
        outlineColor: '#000000',
      },
    },
    showFrame: false,
    frameWidth: 0,
    ...overrides,
  };
}

describe('card canvas rendering', () => {
  it('removes every shadow component and outline for the selected text, preserving the script weight', async () => {
    const { canvas, context } = createMockCanvas();
    const options = createOptions({ textBlocks: [{ text: 'Bonjour', x: 200, y: 300, color: '#fff', fontSize: 32, style: 'modern', align: 'center', shadowEnabled: false, outlineEnabled: false }] });
    options.textStyles.modern.fontWeight = '400';
    options.textStyles.modern.outline = true;
    await renderCardToCanvas(canvas, options, vi.fn());
    expect(context).toMatchObject({ shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, font: '400 32px Arial, sans-serif' });
    expect(context.strokeText).not.toHaveBeenCalled();
    expect(context.fillText).toHaveBeenCalledWith('Bonjour', expect.any(Number), expect.any(Number));
  });

  it('uses the expected dimensions for card and story formats', () => {
    expect(getCardCanvasSize('standard')).toEqual({ width: 400, height: 600 });
    expect(getCardCanvasSize('story')).toEqual({ width: 338, height: 600 });
  });

  it('rejects a missing background or photo before painting an incomplete card', async () => {
    const photoCanvas = createMockCanvas();
    await expect(renderCardToCanvas(
      photoCanvas.canvas,
      createOptions({
        imageElements: [{ src: '/missing-photo.png', x: 10, y: 10, width: 100, height: 100, rotation: 0 }],
      }),
      () => Promise.reject(new Error('network error')),
    )).rejects.toMatchObject({ name: 'CardCanvasAssetError', assetType: 'photo', assetIndex: 1 });
    expect(photoCanvas.operations).toEqual([]);

    const backgroundCanvas = createMockCanvas();
    await expect(renderCardToCanvas(
      backgroundCanvas.canvas,
      createOptions({ backgroundColor: '', backgroundImage: '/missing-background.webp' }),
      () => Promise.reject(new Error('network error')),
    )).rejects.toMatchObject({ name: 'CardCanvasAssetError', assetType: 'background' });
    expect(backgroundCanvas.operations).toEqual([]);
  });

  it('waits for photo assets before painting and keeps the frame above photos but text above the frame', async () => {
    const { canvas, operations } = createMockCanvas();
    let resolvePhoto!: (image: HTMLImageElement) => void;
    const photoPromise = new Promise<HTMLImageElement>((resolve) => {
      resolvePhoto = resolve;
    });
    const options = createOptions({
      imageElements: [{ src: 'photo', x: 10, y: 10, width: 100, height: 100, rotation: 0 }],
      showFrame: true,
      frameWidth: 8,
      textBlocks: [{
        text: 'À la vôtre !',
        x: 200,
        y: 300,
        color: '#ffffff',
        fontSize: 30,
        style: 'modern',
        align: 'center',
      }],
    });

    const rendering = renderCardToCanvas(
      canvas,
      options,
      (src) => src === 'photo' ? photoPromise : Promise.reject(new Error('Unexpected image')),
    );

    expect(operations).toEqual([]);
    resolvePhoto({ id: 'photo', width: 100, height: 100 } as unknown as HTMLImageElement);
    await expect(rendering).resolves.toBe(true);

    const photoIndex = operations.indexOf('image:photo');
    const frameIndex = operations.indexOf('rect:#ffffff');
    const textIndex = operations.indexOf('text:À la vôtre !');
    expect(photoIndex).toBeGreaterThanOrEqual(0);
    expect(frameIndex).toBeGreaterThan(photoIndex);
    expect(textIndex).toBeGreaterThan(frameIndex);
  });

  it('does not paint an obsolete preview after its assets finish loading', async () => {
    const { canvas, operations } = createMockCanvas();
    let resolvePhoto!: (image: HTMLImageElement) => void;
    const photoPromise = new Promise<HTMLImageElement>((resolve) => {
      resolvePhoto = resolve;
    });

    const rendering = renderCardToCanvas(
      canvas,
      createOptions({ imageElements: [{ src: 'photo', x: 0, y: 0, width: 50, height: 50, rotation: 0 }] }),
      () => photoPromise,
      () => false,
    );
    resolvePhoto({ id: 'photo', width: 50, height: 50 } as unknown as HTMLImageElement);

    await expect(rendering).resolves.toBe(false);
    expect(operations).toEqual([]);
  });
  it('keeps Story text inside the visible canvas even when its saved x position is too far right', async () => {
    const { canvas, context } = createMockCanvas();
    await renderCardToCanvas(
      canvas,
      createOptions({
        aspectRatio: 'story',
        textBlocks: [{
          text: 'Test local mobile',
          x: 320,
          y: 300,
          color: '#ffffff',
          fontSize: 28,
          style: 'modern',
          align: 'center',
        }],
      }),
      () => Promise.reject(new Error('No image expected')),
    );

    const calls = context.fillText.mock.calls as unknown as Array<[string, number, number]>;
    expect(calls.length).toBeGreaterThan(0);
    for (const [line, x] of calls) {
      const halfWidth = (line.length * 10) / 2;
      expect(x - halfWidth).toBeGreaterThanOrEqual(16);
      expect(x + halfWidth).toBeLessThanOrEqual(338 - 16);
    }
  });

  it('hits the lower line of a wrapped Story text block', () => {
    const { context } = createMockCanvas();
    const style = createOptions().textStyles.modern;
    const block = {
      text: 'Joyeux\nNoël',
      x: 169,
      y: 300,
      color: '#ffffff',
      fontSize: 24,
      style: 'modern',
      align: 'center' as const,
    };

    expect(isPointInsideCardTextBlock(context as unknown as CanvasRenderingContext2D, block, style, 169, 321, 338, false, 0)).toBe(true);
    expect(isPointInsideCardTextBlock(context as unknown as CanvasRenderingContext2D, block, style, 169, 360, 338, false, 0)).toBe(false);
  });

});

