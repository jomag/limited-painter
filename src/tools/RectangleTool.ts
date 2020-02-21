import ImageProject from '../Image';
import { Tool } from './';
import Layer from '../Layer';

export class RectangleTool extends Tool {
  state: boolean;
  startX: number;
  startY: number;

  constructor() {
    super();
    this.name = 'Rectangle';
    this.startX = 0;
    this.startY = 0;
    this.state = false;
  }

  handleMouseDown(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
    preview: Layer,
  ) {
    if (!this.state) {
      this.startX = x;
      this.startY = y;
      this.state = true;
      this.draw(this.startX, this.startY, x, y, preview);
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
    preview: Layer,
  ) {
    if (this.state) {
      this.draw(this.startX, this.startY, x, y, preview);
    }
  }

  draw(x1: number, y1: number, x2: number, y2: number, preview: Layer) {
    preview.clear();
    preview.drawRectangle(
      x1 < x2 ? x1 : x2,
      y1 < y2 ? y1 : y2,
      x1 < x2 ? x2 - x1 : x1 - x2,
      y1 < y2 ? y2 - y1 : y1 - y2,
      this.foregroundColorIndex,
    );
  }
}
