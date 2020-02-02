import React, { useRef, useEffect } from 'react';

const LimpaCanvas = () => {
  const canvasEl = useRef(null);
  const sourceCanvasEl = useRef(null);

  useEffect(() => {
    const el = (sourceCanvasEl.current as unknown) as HTMLCanvasElement;
    const ctx = el.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 150, 75);
    ctx.lineTo(100, 100);

    const pixels = ctx.createImageData(200, 200);

    for (let y = 0; y < 200; y++) {
      for (let x = 0; x < 200; x++) {
        const o = (y * 200 + x) * 4;
        pixels.data[o] = y;
        pixels.data[o + 1] = x;
        pixels.data[o + 2] = 0;
        pixels.data[o + 3] = 255;
      }
    }

    pixels.data[(200 * 2 + 2) * 4] = 255;
    pixels.data[(200 * 2 + 2) * 4 + 1] = 255;
    pixels.data[(200 * 2 + 2) * 4 + 2] = 255;
    pixels.data[(200 * 2 + 2) * 4 + 3] = 255;

    ctx.putImageData(pixels, 0, 0);

    const el2 = (canvasEl.current as unknown) as HTMLCanvasElement;
    const ctx2 = el2.getContext('2d');

    if (!ctx2) {
      return;
    }

    ctx2.drawImage(el, 10, 10);
  }, []);

  return (
    <>
      <canvas
        ref={sourceCanvasEl}
        width="200"
        height="200"
        style={{ border: '1x px solid blue' }}
      ></canvas>
      <canvas
        ref={canvasEl}
        width="200"
        height="200"
        style={{ border: '1px solid white' }}
      ></canvas>
    </>
  );
};

export default LimpaCanvas;
