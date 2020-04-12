import ImageProject from "../Image";
import Layer from "../Layer";
import { Brush } from "../brush";

export enum ToolType {
  PEN,
  LINE,
  RECTANGLE
}

export type ToolEvent = {
  x: number;
  y: number;

  image: ImageProject;
  preview: Layer;
  brush: Brush;
  evt: any;
};

export class Tool {
  name: string;
  type: ToolType;
  foregroundColorIndex: number;

  constructor(type: ToolType, name: string) {
    this.type = type;
    this.name = name;
    this.foregroundColorIndex = 0;
  }

  setForeground(index: number) {
    this.foregroundColorIndex = index;
  }

  handleMouseDown(evt: ToolEvent) {
    console.log("mouse down...");
  }

  handleMouseUp(evt: ToolEvent) {
    console.log("mouse up...");
  }

  handleMouseMove(evt: ToolEvent) {
    console.log("mouse move...");
  }

  apply(img: ImageProject, preview: Layer) {
    if (preview.usedRect) {
      img.layers[0].copyFrom(
        preview,
        preview.usedRect,
        preview.usedRect.x1,
        preview.usedRect.y1
      );
      preview.clear();
    }
  }
}
