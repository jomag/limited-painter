import ImageProject from '../Image';

export class Tool {
  name: string;

  constructor() {
    this.name = 'Base Tool';
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
    img?.setPixel(x, y, 0);
  }
}
