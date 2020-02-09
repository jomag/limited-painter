import React, { useRef, useEffect, useState } from 'react';
import ImageProject, { AbsRect } from './Image';

export type Color = [number, number, number, number];
export type SetPixelFn = (x: number, y: number, colorIndex: number) => void;

type LimpaCanvasProps = {
  image: ImageProject;
  palette: Color[];
  setPixel: SetPixelFn;
  activeColorIndex: number;
  scaleX: number;
  scaleY: number;
  revision: number;
  grid: boolean;
};

const LimpaCanvas = ({
  image,
  palette,
  activeColorIndex,
  scaleX,
  scaleY,
  revision,
  grid,
}: LimpaCanvasProps) => {
  const canvasEl = useRef(null);
  const sourceCanvasEl = useRef(null);
  const img = useRef(image);
  const [isDrawing, setIsDrawing] = useState(false);

  const { width, height } = image;

  useEffect(() => {
    const redrawDirty = ({ x1, y1, x2, y2 }: AbsRect) => {
      console.log(`REDRAW: (${x1}, ${y1})-(${x2}, ${y2})`);

      const { pixels } = img.current;

      const el = (sourceCanvasEl.current as unknown) as HTMLCanvasElement;
      const ctx = el.getContext('2d');

      if (!ctx) {
        return;
      }

      const image = ctx.createImageData(x2 - x1 + 1, y2 - y1 + 1);

      let o = 0;

      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          const colorIndex = pixels[y * width + x];
          const color = palette[colorIndex];
          image.data[o + 0] = color[0];
          image.data[o + 1] = color[1];
          image.data[o + 2] = color[2];
          image.data[o + 3] = color[3];
          o += 4;
        }
      }

      ctx.putImageData(image, x1, y1);

      const el2 = (canvasEl.current as unknown) as HTMLCanvasElement;
      const ctx2 = el2.getContext('2d');

      if (!ctx2) {
        return;
      }

      ctx2.imageSmoothingEnabled = false;
      // ctx2.mozImageSmoothingEnabled = false;
      // ctx2.webkitImageSmoothingEnabled = false;
      // ctx2.msImageSmoothingEnabled = false;
      const [x, y, w, h] = [x1, y1, x2 - x1 + 1, y2 - y1 + 1];
      const [sx, sy] = [scaleX, scaleY];
      ctx2.drawImage(el, x, y, w, h, x * sx, y * sy, w * sx, h * sy);
    };

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
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
    };

    redrawDirty({ x1: 0, y1: 0, x2: width - 1, y2: height - 1 });

    if (grid) {
      const el2 = (canvasEl.current as unknown) as HTMLCanvasElement;
      const ctx2 = el2.getContext('2d');

      if (!ctx2) {
        return;
      }

      drawGrid(ctx2);
    }

    img.current.on('dirty', redrawDirty);
    return () => {
      img.current.off('dirty', redrawDirty);
    };
  }, [image, palette, scaleX, scaleY, revision, grid]);

  const drawBrush = (x: number, y: number) => {
    const brush = [
      [0, 0],
      [0, -1],
      [-1, 0],
      [1, 0],
      [0, 1],
    ];

    for (const px of brush) {
      img.current.setPixel(x + px[0], y + px[1], activeColorIndex);
    }
  };

  const handleMouseDown = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    const x = Math.floor(ev.nativeEvent.offsetX / scaleX);
    const y = Math.floor(ev.nativeEvent.offsetY / scaleY);
    drawBrush(x, y);
    setIsDrawing(true);
  };

  const handleMouseMove = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    if (isDrawing) {
      const x = Math.floor(ev.nativeEvent.offsetX / scaleX);
      const y = Math.floor(ev.nativeEvent.offsetY / scaleY);
      drawBrush(x, y);
    }
  };

  const handleMouseUp = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    setIsDrawing(false);
  };

  return (
    <>
      <canvas
        ref={sourceCanvasEl}
        width={width}
        height={height}
        style={{ display: 'none' }}
      ></canvas>
      <canvas
        ref={canvasEl}
        width={width * scaleX}
        height={height * scaleY}
        style={{ border: '1px solid white' }}
        onMouseDownCapture={handleMouseDown}
        onMouseUpCapture={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
    </>
  );
};

export default LimpaCanvas;
