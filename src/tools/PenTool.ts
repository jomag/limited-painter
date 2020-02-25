import ImageProject from '../Image';
import { Tool } from './';
import Layer from '../Layer';
import { ToolType } from '.';

export class PenTool extends Tool {
  penSize: number;
  state: boolean;

  constructor(penSize: number) {
    super(ToolType.PEN, `Pen`);
    this.penSize = penSize;
    this.state = false;
  }

  handleMouseDown(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    console.log('mouse down...');
    this.state = true;
    this.draw(x, y, toolLayer);
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
    if (!this.state) {
      // FIXME: only needs to be done when moving from one pixel to another
      preview.clear();
    }

    this.draw(x, y, preview);
  }

  draw(x: number, y: number, preview: Layer) {
    const idx = this.foregroundColorIndex;
    if (this.penSize === 2) {
      preview.setPixel(x - 1, y - 1, idx);
      preview.setPixel(x, y - 1, idx);
      preview.setPixel(x - 1, y, idx);
      preview.setPixel(x, y, idx);
    } else {
      preview.setPixel(x, y, idx);
    }
  }
}

export default PenTool;
