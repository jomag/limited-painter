import IPixelBuffer from './IPixelBuffer';

export enum BrushShape {
  ROUND,
  SQUARE,
}

export type Brush = {
  shape: BrushShape;
  size: number;
};

export const drawBrush = (
  brush: Brush,
  buffer: IPixelBuffer,
  x: number,
  y: number,
  color: number,
) => {
  switch (brush.size) {
    case 0:
    case 1:
      buffer.setPixel(x, y, color);
      break;

    case 2:
      buffer.setPixel(x - 1, y - 1, color);
      buffer.setPixel(x, y - 1, color);
      buffer.setPixel(x, y, color);
      buffer.setPixel(x - 1, y, color);
      break;

    case 3:
      if (brush.shape === BrushShape.ROUND) {
        buffer.setPixel(x - 1, y, color);
        buffer.setPixel(x + 1, y, color);
        buffer.setPixel(x, y - 1, color);
        buffer.setPixel(x, y + 1, color);
        buffer.setPixel(x, y, color);
      } else {
        for (let nx = x - 1; nx <= x + 1; nx++) {
          for (let ny = y - 1; ny <= y + 1; ny++) {
            buffer.setPixel(nx, ny, color);
          }
        }
      }
  }
};
