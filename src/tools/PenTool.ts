import ImageProject from "../Image";
import { Tool } from "./";
import Layer from "../Layer";
import { ToolType } from ".";
import { ToolEvent } from ".";
import { Brush, drawBrush } from "../brush";

export class PenTool extends Tool {
  penSize: number;
  state: boolean;

  constructor(penSize: number) {
    super(ToolType.PEN, `Pen`);
    this.penSize = penSize;
    this.state = false;
  }

  handleMouseDown(evt: ToolEvent) {
    this.state = true;
    this.draw(evt.x, evt.y, evt.preview, evt.brush);
  }

  handleMouseUp(evt: ToolEvent) {
    if (this.state) {
      this.apply(evt.image, evt.preview);
      this.state = false;
    }
  }

  handleMouseMove(evt: ToolEvent) {
    if (!this.state) {
      // FIXME: only needs to be done when moving from one pixel to another
      evt.preview.clear();
    }

    this.draw(evt.x, evt.y, evt.preview, evt.brush);
  }

  draw(x: number, y: number, preview: Layer, brush: Brush) {
    drawBrush(brush, preview, x, y, this.foregroundColorIndex);
  }
}

export default PenTool;
