import { describe, expect, it, vi } from 'vitest';
import {
  getCardCanvasSize,
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
  it('uses the expected dimensions for card and story formats', () => {
    expect(getCardCanvasSize('standard')).toEqual({ width: 400, height: 600 });
    expect(getCardCanvasSize('story')).toEqual({ width: 338, height: 600 });
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
});
