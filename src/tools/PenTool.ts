import ImageProject from '../Image';
import { Tool } from './';

export class PenTool extends Tool {
  penSize: number;

  constructor(penSize: number) {
    super();
    this.name = `Pen ${penSize}`;
    this.penSize = penSize;
  }

  handleMouseDown(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
  ) {
    console.log('mouse down...');
  }

  handleMouseUp(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
  ) {
    console.log('mouse up...');
  }

  handleMouseMove(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
  ) {
    console.log('mouse move...');
    if (this.penSize === 2) {
      img?.setPixel(x - 1, y - 1, 0);
      img?.setPixel(x, y - 1, 0);
      img?.setPixel(x - 1, y, 0);
      img?.setPixel(x, y, 0);
    } else {
      img?.setPixel(x, y, 0);
    }
  }
}

export default PenTool;
