import ImageProject from "../Image";
import { Tool } from "./";
import Layer from "../Layer";
import { ToolType } from ".";
import { ToolEvent } from ".";
import { Brush, drawBrush } from "../brush";

export class LineTool extends Tool {
  state: boolean;
  startX: number;
  startY: number;

  constructor() {
    super(ToolType.LINE, "Line");
    this.startX = 0;
    this.startY = 0;
    this.state = false;
  }

  handleMouseDown(evt: ToolEvent) {
    if (!this.state) {
      this.startX = evt.x;
      this.startY = evt.y;
      this.state = true;
      this.draw(this.startX, this.startY, evt.x, evt.y, evt.brush, evt.preview);
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
      this.draw(this.startX, this.startY, evt.x, evt.y, evt.brush, evt.preview);
    }
  }

  drawHorz(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    brush: Brush,
    preview: Layer
  ) {
    const dx = x2 - x1;
    let dy = y2 - y1;
    let yi = 1;

    if (dy < 0) {
      yi = -1;
      dy = -dy;
    }

    let D = 2 * dy - dx;
    let y = y1;

    for (let x = x1; x <= x2; x++) {
      drawBrush(brush, preview, x, y, this.foregroundColorIndex);

      if (D > 0) {
        y += yi;
        D = D - 2 * dx;
      }
      D = D + 2 * dy;
    }
  }

  drawVert(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    brush: Brush,
    preview: Layer
  ) {
    let dx = x2 - x1;
    const dy = y2 - y1;
    let xi = 1;

    if (dx < 0) {
      xi = -1;
      dx = -dx;
    }

    let D = 2 * dx - dy;
    let x = x1;

    for (let y = y1; y <= y2; y++) {
      drawBrush(brush, preview, x, y, this.foregroundColorIndex);

      if (D > 0) {
        x += xi;
        D = D - 2 * dy;
      }
      D = D + 2 * dx;
    }
  }

  draw(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    brush: Brush,
    preview: Layer
  ) {
    preview.clear();
    if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
      if (x1 > x2) {
        this.drawHorz(x2, y2, x1, y1, brush, preview);
      } else {
        this.drawHorz(x1, y1, x2, y2, brush, preview);
      }
    } else {
      if (y1 > y2) {
        this.drawVert(x2, y2, x1, y1, brush, preview);
      } else {
        this.drawVert(x1, y1, x2, y2, brush, preview);
      }
    }
  }
}

export default LineTool;
