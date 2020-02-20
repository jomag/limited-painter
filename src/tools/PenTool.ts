import ImageProject from '../Image';
import { Tool } from './';

export class PenTool extends Tool {
  penSize: number;
  state: boolean;

  constructor(penSize: number) {
    super();
    this.name = `Pen ${penSize}`;
    this.penSize = penSize;
    this.state = false;
  }

  handleMouseDown(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
  ) {
    console.log('mouse down...');
    this.state = true;
    this.draw(x, y, img);
  }

  handleMouseUp(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
  ) {
    console.log('mouse up...');
    this.state = false;
  }

  handleMouseMove(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
  ) {
    console.log('mouse move...');
    if (this.state) {
      this.draw(x, y, img);
    }
  }

  draw(x: number, y: number, img: ImageProject) {
    const idx = this.foregroundColorIndex;
    if (this.penSize === 2) {
      img?.setPixel(x - 1, y - 1, idx);
      img?.setPixel(x, y - 1, idx);
      img?.setPixel(x - 1, y, idx);
      img?.setPixel(x, y, idx);
    } else {
      img?.setPixel(x, y, idx);
    }
  }
}

export default PenTool;
