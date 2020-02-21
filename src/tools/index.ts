import ImageProject from '../Image';
import Layer from '../Layer';

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
    toolLayer: Layer,
  ) {
    console.log('mouse down...');
  }

  handleMouseUp(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    console.log('mouse up...');
  }

  handleMouseMove(
    evt: React.MouseEvent,
    x: number,
    y: number,
    img: ImageProject,
    toolLayer: Layer,
  ) {
    console.log('mouse move...');
  }

  apply(img: ImageProject, preview: Layer) {
    if (preview.usedRect) {
      img.layers[0].copyFrom(
        preview,
        preview.usedRect,
        preview.usedRect.x1,
        preview.usedRect.y1,
      );
      preview.clear();
    }
  }
}
