import ImageProject from '../Image';

export class Tool {
  name: string;
  foregroundColorIndex: number;

  constructor() {
    this.name = 'Base Tool';
    this.foregroundColorIndex = 0;
  }

  setForeground(index: number) {
    this.foregroundColorIndex = index;
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
  }
}
