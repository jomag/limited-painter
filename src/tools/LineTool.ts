import ImageProject from '../Image';
import { Tool } from './';
import Layer from '../Layer';

export class LineTool extends Tool {
  state: boolean;
  startX: number;
  startY: number;

  constructor() {
    super();
    this.name = 'Line';
    this.startX = 0;
    this.startY = 0;
    this.state = false;
  }

  handleMouseDown(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    if (!this.state) {
      this.startX = x;
      this.startY = y;
      this.state = true;
      this.draw(this.startX, this.startY, x, y, img, toolLayer);
    }
  }

  handleMouseUp(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
    preview: Layer,
  ) {
    if (this.state) {
      this.apply(img, preview);
      this.state = false;
    }
  }

  handleMouseMove(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    if (this.state) {
      this.draw(this.startX, this.startY, x, y, img, toolLayer);
    }
  }

  drawHorz(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    const dx = x2 - x1;
    let dy = y2 - y1;

    // Draw along X
    let D = 2 * dy - dx;
    let yi = 1;
    if (y1 > y2) {
      yi = -1;
      dy = -dy;
    }
    let y = y1;
    for (let x = x1; x <= x2; x++) {
      toolLayer.setPixel(x, y, this.foregroundColorIndex);
      if (D > 0) {
        y += yi;
        D = D - 2 * dx;
      }
      D = D + 2 * dy;
    }
  }

  drawVert(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    let dx = x2 - x1;
    const dy = y2 - y1;

    let D = 2 * dx - dy;
    let xi = 1;
    if (x1 > x2) {
      xi = -1;
      dx = -dx;
    }
    let x = x1;
    for (let y = y1; y <= y2; y++) {
      toolLayer.setPixel(x, y, this.foregroundColorIndex);
      if (D > 0) {
        x += xi;
        D = D - 2 * dy;
      }
      D = D + 2 * dx;
    }
  }

  draw(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    toolLayer.clear();
    if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
      if (x1 > x2) {
        this.drawHorz(x2, y2, x1, y1, img, toolLayer);
      } else {
        this.drawHorz(x1, y1, x2, y2, img, toolLayer);
      }
    } else {
      if (y1 > y2) {
        this.drawVert(x2, y2, x1, y1, img, toolLayer);
      } else {
        this.drawVert(x1, y1, x2, y2, img, toolLayer);
      }
    }
  }
}

export default LineTool;
