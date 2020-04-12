import EventEmitter from 'events';
import { AbsRect } from './Image';

class Layer extends EventEmitter {
  width: number;
  height: number;
  pixels: number[];

  dirty?: AbsRect = undefined;

  // The area of the layer that contains defined pixels
  usedRect?: AbsRect = undefined;

  constructor(width: number, height: number, pixels?: number[]) {
    super();
    this.width = width;
    this.height = height;

    this.pixels = [];

    if (pixels) {
      this.pixels = pixels.slice();
      this.usedRect = { x1: 0, y1: 0, x2: width, y2: height };
    } else {
      this.clear();
    }
  }

  addDirtyArea(area: AbsRect) {
    if (this.dirty) {
      this.dirty = {
        x1: Math.min(this.dirty.x1, area.x1),
        y1: Math.min(this.dirty.y1, area.y1),
        x2: Math.max(this.dirty.x2, area.x2),
        y2: Math.max(this.dirty.y2, area.y2),
      };
    } else {
      this.dirty = area;
      setTimeout(() => {
        if (this.dirty) {
          this.emit('dirty', this.dirty);
          this.dirty = undefined;
        }
      });
    }
  }

  addUsedArea(area: AbsRect) {
    if (this.usedRect) {
      this.usedRect = {
        x1: Math.min(this.usedRect.x1, area.x1),
        y1: Math.min(this.usedRect.y1, area.y1),
        x2: Math.max(this.usedRect.x2, area.x2),
        y2: Math.max(this.usedRect.y2, area.y2),
      };
    } else {
      this.usedRect = area;
    }
  }

  clear() {
    if (this.usedRect) {
      this.addDirtyArea(this.usedRect);
      // FIXME: only clear the used area
      this.pixels = Array(this.width * this.height).fill(-1);
      this.usedRect = undefined;
    }
  }

  getIndex(x: number, y: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.pixels[y * this.width + x];
    }

    throw new Error(`(${x}, ${y}) is out of range`);
  }

  drawRectangle(x1: number, y1: number, w: number, h: number, color: number) {
    for (let y = y1; y < y1 + h; y++) {
      for (let x = x1; x < x1 + w; x++) {
        const n = y * this.width + x;
        this.pixels[n] = color;
      }
    }

    const area = { x1, y1, x2: x1 + w, y2: y1 + h };
    this.addUsedArea(area);
    this.addDirtyArea(area);
  }

  setPixel(x: number, y: number, color: number) {
    const n = y * this.width + x;

    if (this.pixels[n] !== color) {
      this.pixels[n] = color;

      if (this.usedRect) {
        this.usedRect = {
          x1: Math.min(this.usedRect.x1, x),
          y1: Math.min(this.usedRect.y1, y),
          x2: Math.max(this.usedRect.x2, x),
          y2: Math.max(this.usedRect.y2, y),
        };
      } else {
        this.usedRect = {
          x1: x,
          y1: y,
          x2: x,
          y2: y,
        };
      }

      this.addDirtyArea({ x1: x, y1: y, x2: x, y2: y });
    }
  }

  getPixel(x: number, y: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.pixels[y * this.width + x];
    }
  }

  copyFrom(source: Layer, rect: AbsRect, offsetX: number, offsetY: number) {
    let oy = offsetY;
    for (let y = rect.y1; y <= rect.y2; y++) {
      let ox = offsetX;
      for (let x = rect.x1; x <= rect.x2; x++) {
        const idx = source.getIndex(x, y);
        if (idx != -1) {
          this.setPixel(ox, oy, idx);
        }
        ox++;
      }
      oy++;
    }
  }
}

export default Layer;
