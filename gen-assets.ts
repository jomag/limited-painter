import fs from 'fs';
import { PNG } from 'pngjs';
import { Brush, BrushShape, drawBrush } from './src/brush';
import IPixelBuffer from './src/IPixelBuffer';

const brushesDir = './public/img/brushes';
const scale = 2;

if (!fs.existsSync(brushesDir)) {
  fs.mkdirSync(brushesDir);
}

const brushes: { [name: string]: Brush } = {
  round1: { shape: BrushShape.ROUND, size: 1 },
  round2: { shape: BrushShape.ROUND, size: 2 },
  round3: { shape: BrushShape.ROUND, size: 3 },
  square1: { shape: BrushShape.SQUARE, size: 1 },
  square2: { shape: BrushShape.SQUARE, size: 2 },
  square3: { shape: BrushShape.SQUARE, size: 3 },
};

for (const name of Object.keys(brushes)) {
  const brush = brushes[name];
  const width = brush.size + 2;
  const height = brush.size + 2;

  const png = new PNG({
    colorType: 4,
    width: width * scale,
    height: height * scale,
  });

  const buf: IPixelBuffer = {
    setPixel: (x: number, y: number, color: number) => {
      for (let sy = y * scale; sy < (y + 1) * scale; sy++) {
        for (let sx = x * scale; sx < (x + 1) * scale; sx++) {
          const n = (sy * width * scale + sx) * 4;
          png.data[n] = 255;
          png.data[n + 1] = 255;
          png.data[n + 2] = 255;
          png.data[n + 3] = 255;
        }
      }
    },
    getPixel: (x: number, y: number) => undefined,
  };

  drawBrush(brush, buf, Math.floor(width / 2), Math.floor(height / 2), 1);

  const output = PNG.sync.write(png, { colorType: 4 });
  fs.writeFileSync(`${brushesDir}/${name}.png`, output);
}
