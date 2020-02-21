import EventEmitter from 'events';

import { Color } from './LimpaCanvas';
import * as palette from './palettes';
import Layer from './Layer';

export type AbsRect = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

class ImageProject extends EventEmitter {
  layers: Layer[] = [];
  pixelAspectRatio: number = 1;
  palette: Color[] = [];
  width: number = 0;
  height: number = 0;

  // Highest pixel value (index) in the image
  depth: number = 0;

  static createFromArray(width: number, height: number, pixels: number[]) {
    const img = new ImageProject();
    img.width = width;
    img.height = height;
    img.layers = [new Layer(width, height, pixels)];
    img.depth = Math.max(...img.layers[0].pixels) + 1;
    img.palette = palette.c64alt;
    return img;
  }

  getIndex(x: number, y: number) {
    // FIXME: since layers were introduced, it's not clear what this function should do
    // Maybe iterate layers in reverse until a defined pixel is found.
    for (let n = this.layers.length; n > 0; n--) {
      const idx = this.layers[n - 1].getIndex(x, y);
      if (idx >= 0) {
        return idx;
      }
    }

    return -1;
  }

  getColor(x: number, y: number): Color {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const idx = this.getIndex(x, y);
      if (idx >= 0 && idx < this.palette.length) {
        return this.palette[idx];
      }

      throw new Error(`Invalid color index ${idx} at (${x}, ${y})`);
    }

    throw new Error(`(${x}, ${y}) is out of range`);
  }

  toJson() {
    // FIXME: this needs to be updated to handle multiple layers
    const obj = {
      width: this.width,
      height: this.height,
      depth: this.depth,
    };

    if (this.depth < 17) {
      return {
        ...obj,
        pixelFormat: 'hex',
        pixels: this.layers[0].pixels.map(n => n.toString(16)).join(''),
      };
    }

    throw new Error(`Can't serialize image with depth ${this.depth}`);
  }

  static createFromJson(obj: any) {
    // FIXME: don't use 'any' for obj
    const img = new ImageProject();
    img.width = obj.width;
    img.height = obj.height;
    img.palette = obj.palette || palette.c64alt;

    if (obj.pixelFormat === 'hex') {
      const pixels = Array.from(obj.pixels as string).map((c: string) =>
        parseInt(c, 16),
      );
      img.layers = [new Layer(img.width, img.height, pixels)];
    } else {
      throw new Error(`Illegal pixel format: ${obj.pixelFormat}`);
    }

    return img;
  }
}

export default ImageProject;
