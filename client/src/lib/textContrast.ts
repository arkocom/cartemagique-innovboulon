function luminance(red: number, green: number, blue: number): number {
  const linear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
}

/** Suggests a text color from the background beneath that text, without changing its effects. */
export function chooseContrastingTextColor(pixels: Uint8ClampedArray): string {
  if (pixels.length < 4) return '#111827';
  const stride = 4 * Math.max(1, Math.ceil(pixels.length / (4 * 4096)));
  let total = 0;
  let count = 0;
  for (let index = 0; index + 3 < pixels.length; index += stride) {
    const alpha = pixels[index + 3] / 255;
    total += luminance(
      pixels[index] * alpha + 255 * (1 - alpha),
      pixels[index + 1] * alpha + 255 * (1 - alpha),
      pixels[index + 2] * alpha + 255 * (1 - alpha),
    );
    count++;
  }
  const background = total / count;
  const dark = luminance(17, 24, 39);
  const darkContrast = (Math.max(background, dark) + 0.05) / (Math.min(background, dark) + 0.05);
  const whiteContrast = 1.05 / (background + 0.05);
  return darkContrast >= whiteContrast ? '#111827' : '#ffffff';
}
