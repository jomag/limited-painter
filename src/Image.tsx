import EventEmitter from 'events';

import { Color } from './LimpaCanvas';
import * as palette from './palettes';

export type AbsRect = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

class ImageProject extends EventEmitter {
  pixels: number[] = [];
  pixelAspectRatio: number = 1;
  palette: Color[] = [];
  width: number = 0;
  height: number = 0;

  // Highest pixel value (index) in the image
  depth: number = 0;

  dirty: boolean = false;
  dirtyRect: AbsRect = { x1: 0, x2: 0, y1: 0, y2: 0 };

  static createFromArray(width: number, height: number, pixels: number[]) {
    const img = new ImageProject();
    img.width = width;
    img.height = height;
    img.pixels = pixels.slice();
    img.depth = Math.max(...img.pixels) + 1;
    img.palette = palette.c64alt;
    return img;
  }

  getIndex(x: number, y: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.pixels[y * this.width + x];
    }

    throw new Error(`(${x}, ${y}) is out of range`);
  }

  getColor(x: number, y: number): Color {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const idx = this.pixels[y * this.width + x];
      if (idx >= 0 && idx < this.palette.length) {
        return this.palette[idx];
      }

      throw new Error(`Invalid color index ${idx} at (${x}, ${y})`);
    }

    throw new Error(`(${x}, ${y}) is out of range`);
  }

  setPixel(x: number, y: number, color: number) {
    const n = y * this.width + x;
    if (this.pixels[n] !== color) {
      this.pixels[n] = color;

      if (!this.dirty) {
        this.dirty = true;
        this.dirtyRect = { x1: x, y1: y, x2: x, y2: y };
      } else {
        if (this.dirtyRect.x1 > x) {
          this.dirtyRect.x1 = x;
        }

        if (this.dirtyRect.y1 > y) {
          this.dirtyRect.y1 = y;
        }

        if (this.dirtyRect.x2 < x) {
          this.dirtyRect.x2 = x;
        }

        if (this.dirtyRect.y2 < y) {
          this.dirtyRect.y2 = y;
        }
      }

      setTimeout(() => {
        if (this.dirty) {
          this.emit('dirty', this.dirtyRect);
          this.dirty = false;
        }
      }, 0);
    }
  }

  toJson() {
    const obj = {
      width: this.width,
      height: this.height,
      depth: this.depth,
    };

    if (this.depth < 17) {
      return {
        ...obj,
        pixelFormat: 'hex',
        pixels: this.pixels.map(n => n.toString(16)).join(''),
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
      img.pixels = Array.from(obj.pixels as string).map((c: string) =>
        parseInt(c, 16),
      );
    } else {
      throw new Error(`Illegal pixel format: ${obj.pixelFormat}`);
    }

    return img;
  }
}

export default ImageProject;
