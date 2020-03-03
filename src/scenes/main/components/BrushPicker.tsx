import React, { useRef, useEffect } from 'react';
import styles from './BrushPicker.module.css';
import { Brush, BrushShape } from '../../../brush';
import Layer from '../../../Layer';

type Props = {
  brush: Brush;
  setBrush: (brush: Brush) => void;
};

const BrushPicker = ({ brush, setBrush }: Props) => {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const brushes = [
    [
      { shape: BrushShape.ROUND, size: 1 },
      { shape: BrushShape.ROUND, size: 2 },
      { shape: BrushShape.ROUND, size: 3 },
    ],
    [
      { shape: BrushShape.SQUARE, size: 3 },
      { shape: BrushShape.SQUARE, size: 2 },
      { shape: BrushShape.SQUARE, size: 1 },
    ],
  ];

  useEffect(() => {
    const ctx = sourceRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }

    const img = ctx.createImageData(32, 32);

    for (let n = 0; n < 32 * 32; n++) {
      img.data[n * 4] = (n % 16) * 10;
      img.data[n * 4 + 1] = (n % 31) * 10;
      img.data[n * 4 + 2] = (n % 55) * 10;
      img.data[n * 4 + 3] = 255;
    }

    ctx.putImageData(img, 0, 0);

    const canvasCtx = canvasRef.current?.getContext('2d');
    if (canvasCtx) {
      canvasCtx.imageSmoothingEnabled = false;
      canvasCtx?.drawImage(sourceRef.current!, 0, 0, 32, 32, 0, 0, 64, 64);
    }
  });

  return (
    <div className={styles.brushPicker}>
      <canvas ref={sourceRef} width={32} height={32}></canvas>
      <canvas ref={canvasRef} width={64} height={64}></canvas>
      <button onClick={() => setBrush({ shape: BrushShape.ROUND, size: 1 })}>
        1
      </button>
      <button onClick={() => setBrush({ shape: BrushShape.ROUND, size: 2 })}>
        2
      </button>
      <button onClick={() => setBrush({ shape: BrushShape.ROUND, size: 3 })}>
        3
      </button>
      <br />
      <button onClick={() => setBrush({ shape: BrushShape.SQUARE, size: 1 })}>
        4
      </button>
      <button onClick={() => setBrush({ shape: BrushShape.SQUARE, size: 2 })}>
        5
      </button>
      <button onClick={() => setBrush({ shape: BrushShape.SQUARE, size: 3 })}>
        6
      </button>
    </div>
  );
};

export default BrushPicker;
