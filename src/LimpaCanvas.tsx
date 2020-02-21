import React, { Component } from 'react';
import ImageProject, { AbsRect } from './Image';
import { Tool } from './tools';
import Layer from './Layer';

export type Color = [number, number, number, number];

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

type LimpaCanvasProps = {
  image: ImageProject;
  scaleX: number;
  scaleY: number;
  grid: boolean;
  tool: Tool;
};

class LimpaCanvas extends Component<LimpaCanvasProps> {
  image?: ImageProject;
  toolLayer: Layer;
  sourceRef: React.RefObject<HTMLCanvasElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: LimpaCanvasProps) {
    super(props);

    this.sourceRef = React.createRef<HTMLCanvasElement>();
    this.canvasRef = React.createRef<HTMLCanvasElement>();

    this.handleDirty = this.handleDirty.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.image = props.image;
    this.toolLayer = new Layer(props.image.width, props.image.height);

    // FIXME: need improvements after introducing layers
    this.image.layers[0].on('dirty', this.handleDirty);
    this.toolLayer.on('dirty', this.handleDirty);
  }

  componentDidMount() {
    if (this.image) {
      this.renderDirty({
        x1: 0,
        y1: 0,
        x2: this.image.width - 1,
        y2: this.image.height - 1,
      });
    }
  }

  componentDidUpdate(prevProps: LimpaCanvasProps) {
    if (prevProps.image !== this.image) {
      this.image?.off('dirty', this.handleDirty);
      this.image = this.props.image;
      this.image.on('dirty', this.handleDirty);
    }

    this.renderDirty({
      x1: 0,
      y1: 0,
      x2: this.image.width - 1,
      y2: this.image.height - 1,
    });
  }

  componentWillUnmount() {
    this.image?.off('dirty', this.handleDirty);
  }

  getEventPixel(evt: React.MouseEvent) {
    return [
      Math.floor(evt.nativeEvent.offsetX / this.props.scaleX),
      Math.floor(evt.nativeEvent.offsetY / this.props.scaleY),
    ];
  }

  handleMouseDown(evt: React.MouseEvent) {
    if (this.image) {
      const px = this.getEventPixel(evt);
      this.props.tool?.handleMouseDown(
        evt,
        px[0],
        px[1],
        this.image,
        this.toolLayer,
      );
    }
  }

  handleMouseUp(evt: React.MouseEvent) {
    if (this.image) {
      const px = this.getEventPixel(evt);
      this.props.tool?.handleMouseUp(
        evt,
        px[0],
        px[1],
        this.image,
        this.toolLayer,
      );
    }
  }

  handleMouseMove(evt: React.MouseEvent) {
    if (this.image) {
      const px = this.getEventPixel(evt);
      this.props.tool?.handleMouseMove(
        evt,
        px[0],
        px[1],
        this.image,
        this.toolLayer,
      );
    }
  }

  handleDirty(area: AbsRect) {
    this.renderDirty(area);
  }

  drawBrush = (x: number, y: number) => {
    if (!this.image) {
      return;
    }

    const brush = [
      [0, 0],
      [0, -1],
      [-1, 0],
      [1, 0],
      [0, 1],
    ];

    for (const px of brush) {
      this.image.layers[0].setPixel(x + px[0], y + px[1], 1);
      this.toolLayer.setPixel(x + px[0], y + px[1], 1);
    }
  };

  renderDirty({ x1, y1, x2, y2 }: AbsRect) {
    // console.log(`REDRAW: (${x1}, ${y1})-(${x2}, ${y2})`);

    if (!this.image) {
      return;
    }

    const { width, height } = this.image;

    let dirtyX = clamp(x1, 0, width);
    let dirtyY = clamp(y1, 0, height);
    let dirtyWidth = clamp(x2, 0, width) - x1 + 1;
    let dirtyHeight = clamp(y2, 0, height) - y1 + 1;

    const el = (this.sourceRef.current as unknown) as HTMLCanvasElement;

    const ctx = el.getContext('2d');

    if (!ctx) {
      return;
    }

    const imageData = ctx.createImageData(dirtyWidth, dirtyHeight);

    for (const layer of [...this.image.layers, this.toolLayer]) {
      let o = 0;
      for (let y = dirtyY; y < dirtyY + dirtyHeight; y++) {
        for (let x = dirtyX; x < dirtyX + dirtyWidth; x++) {
          const colorIndex = layer.pixels[y * width + x];
          if (colorIndex >= 0) {
            const color = this.image.palette[colorIndex];
            imageData.data[o + 0] = color[0];
            imageData.data[o + 1] = color[1];
            imageData.data[o + 2] = color[2];
            imageData.data[o + 3] = color[3];
          }
          o += 4;
        }
      }
    }

    ctx.putImageData(imageData, dirtyX, dirtyY);

    const el2 = (this.canvasRef.current as unknown) as HTMLCanvasElement;
    const ctx2 = el2.getContext('2d');

    if (!ctx2) {
      return;
    }

    ctx2.imageSmoothingEnabled = false;
    // ctx2.mozImageSmoothingEnabled = false;
    // ctx2.webkitImageSmoothingEnabled = false;
    // ctx2.msImageSmoothingEnabled = false;

    const [x, y, w, h] = [dirtyX, dirtyY, dirtyWidth, dirtyHeight];
    const [sx, sy] = [this.props.scaleX, this.props.scaleY];
    ctx2.drawImage(el, x, y, w, h, x * sx, y * sy, w * sx, h * sy);
  }

  renderGrid(ctx: CanvasRenderingContext2D) {
    if (!this.image) {
      return;
    }

    const { width, height } = this.image;
    const { scaleX, scaleY } = this.props;

    ctx.beginPath();

    for (let x = 1; x < width; x++) {
      ctx.moveTo(x * scaleX + 0.5, 0);
      ctx.lineTo(x * scaleX + 0.5, height * scaleY);
    }

    for (let y = 1; y < height; y++) {
      ctx.moveTo(0, y * scaleY + 0.5);
      ctx.lineTo(width * scaleX, y * scaleY + 0.5);
    }

    ctx.lineWidth = 1;
    ctx.setLineDash([1, 1]);
    ctx.lineDashOffset = 0;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.lineDashOffset = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  render() {
    const { width, height } = this.image || { width: 0, height: 0 };
    const { scaleX, scaleY } = this.props;

    return (
      <>
        <canvas
          ref={this.sourceRef}
          width={width}
          height={height}
          style={{ display: 'none' }}
        ></canvas>
        <canvas
          ref={this.canvasRef}
          width={width * scaleX}
          height={height * scaleY}
          style={{ border: '1px solid white' }}
          onMouseDownCapture={this.handleMouseDown}
          onMouseUpCapture={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
        ></canvas>
      </>
    );
  }
}

export default LimpaCanvas;
