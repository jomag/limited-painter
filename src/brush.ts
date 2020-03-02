import Layer from "./Layer";

export enum BrushShape {
  ROUND,
  SQUARE
}

export type Brush = {
  shape: BrushShape;
  size: number;
};

export const drawBrush = (
  brush: Brush,
  layer: Layer,
  x: number,
  y: number,
  color: number
) => {
  switch (brush.size) {
    case 0:
    case 1:
      layer.setPixel(x, y, color);
      break;

    case 2:
      layer.setPixel(x - 1, y - 1, color);
      layer.setPixel(x, y - 1, color);
      layer.setPixel(x, y, color);
      layer.setPixel(x - 1, y, color);
      break;

    case 3:
      if (brush.shape === BrushShape.ROUND) {
        layer.setPixel(x - 1, y, color);
        layer.setPixel(x + 1, y, color);
        layer.setPixel(x, y - 1, color);
        layer.setPixel(x, y + 1, color);
        layer.setPixel(x, y, color);
      } else {
        for (let nx = x - 1; nx <= x + 1; nx++) {
          for (let ny = y - 1; ny <= y + 1; ny++) {
            layer.setPixel(nx, ny, color);
          }
        }
      }
  }
};
