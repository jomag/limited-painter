import EventEmitter from 'events';

export type AbsRect = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

class ImageProject extends EventEmitter {
  pixels: number[] = [];
  pixelAspectRatio: number = 1;
  width: number = 0;
  height: number = 0;

  dirty: boolean = false;
  dirtyRect: AbsRect = { x1: 0, x2: 0, y1: 0, y2: 0 };

  static createFromArray(width: number, height: number, pixels: number[]) {
    const img = new ImageProject();
    img.width = width;
    img.height = height;
    img.pixels = pixels.slice();
    return img;
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
}

export default ImageProject;
