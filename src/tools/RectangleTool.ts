import ImageProject from "../Image";
import { Tool } from "./";
import Layer from "../Layer";
import { ToolType } from ".";
import { ToolEvent } from ".";

export class RectangleTool extends Tool {
  state: boolean;
  startX: number;
  startY: number;

  constructor() {
    super(ToolType.RECTANGLE, "Rectangle");
    this.startX = 0;
    this.startY = 0;
    this.state = false;
  }

  handleMouseDown(evt: ToolEvent) {
    if (!this.state) {
      this.startX = evt.x;
      this.startY = evt.y;
      this.state = true;
      this.draw(this.startX, this.startY, evt.x, evt.y, evt.preview);
    }
  }

  handleMouseUp(evt: ToolEvent) {
    if (this.state) {
      this.apply(evt.image, evt.preview);
      this.state = false;
    }
  }

  handleMouseMove(evt: ToolEvent) {
    if (this.state) {
      this.draw(this.startX, this.startY, evt.x, evt.y, evt.preview);
    }
  }

  draw(x1: number, y1: number, x2: number, y2: number, preview: Layer) {
    preview.clear();
    preview.drawRectangle(
      x1 < x2 ? x1 : x2,
      y1 < y2 ? y1 : y2,
      x1 < x2 ? x2 - x1 : x1 - x2,
      y1 < y2 ? y2 - y1 : y1 - y2,
      this.foregroundColorIndex
    );
  }
}
