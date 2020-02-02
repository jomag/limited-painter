import React, { useRef, useEffect, useState } from "react";

export type Color = [number, number, number, number];
export type SetPixelFn = (x: number, y: number, colorIndex: number) => void;

type LimpaCanvasProps = {
  pixels: number[];
  width: number;
  height: number;
  palette: Color[];
  setPixel: SetPixelFn;
  activeColorIndex: number;
  scaleX: number;
  scaleY: number;
  revision: number;
  grid: boolean;
};

const LimpaCanvas = ({
  pixels,
  width,
  height,
  palette,
  setPixel,
  activeColorIndex,
  scaleX,
  scaleY,
  revision,
  grid
}: LimpaCanvasProps) => {
  const canvasEl = useRef(null);
  const sourceCanvasEl = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.lineDashOffset = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  };

  useEffect(() => {
    console.log("REDRAW!");
    const el = (sourceCanvasEl.current as unknown) as HTMLCanvasElement;
    const ctx = el.getContext("2d");

    if (!ctx) {
      return;
    }

    const image = ctx.createImageData(width, height);

    let o = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const colorIndex = pixels[y * width + x];
        const color = palette[colorIndex];
        image.data[o + 0] = color[0];
        image.data[o + 1] = color[1];
        image.data[o + 2] = color[2];
        image.data[o + 3] = color[3];
        o += 4;
      }
    }

    ctx.putImageData(image, 0, 0);

    const el2 = (canvasEl.current as unknown) as HTMLCanvasElement;
    const ctx2 = el2.getContext("2d");

    if (!ctx2) {
      return;
    }

    ctx2.imageSmoothingEnabled = false;
    // ctx2.mozImageSmoothingEnabled = false;
    // ctx2.webkitImageSmoothingEnabled = false;
    // ctx2.msImageSmoothingEnabled = false;
    ctx2.drawImage(el, 0, 0, width * scaleX, height * scaleY);

    if (grid) {
      drawGrid(ctx2);
    }
  }, [pixels, width, height, palette, scaleX, scaleY, revision, grid]);

  const handleMouseDown = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    ev.stopPropagation();
    const x = Math.floor(ev.nativeEvent.offsetX / scaleX);
    const y = Math.floor(ev.nativeEvent.offsetY / scaleY);
    setPixel(x, y, activeColorIndex);
    setIsDrawing(true);
  };

  const handleMouseMove = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    ev.stopPropagation();
    if (isDrawing) {
      const x = Math.floor(ev.nativeEvent.offsetX / scaleX);
      const y = Math.floor(ev.nativeEvent.offsetY / scaleY);
      setPixel(x, y, activeColorIndex);
    }
  };

  const handleMouseUp = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>
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
        style={{ display: "none" }}
      ></canvas>
      <canvas
        ref={canvasEl}
        width={width * scaleX}
        height={height * scaleY}
        style={{ border: "1px solid white" }}
        onMouseDownCapture={handleMouseDown}
        onMouseUpCapture={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
    </>
  );
};

export default LimpaCanvas;
