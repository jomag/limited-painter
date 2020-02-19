import React, { useRef, useEffect } from 'react';
import ImageProject from '../Image';

type Props = {
  image: ImageProject;
};

const Thumbnail = ({ image }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      const el = (canvasRef.current as unknown) as HTMLCanvasElement;
      const ctx = el.getContext('2d');
      if (!ctx) {
        return;
      }

      const imageData = ctx.createImageData(image.width, image.height);
      let o = 0;
      for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
          const color = image.getColor(x, y);
          imageData.data[o + 0] = color[0];
          imageData.data[o + 1] = color[1];
          imageData.data[o + 2] = color[2];
          imageData.data[o + 3] = color[3];
          o += 4;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }
  }, [canvasRef, image]);

  return <canvas ref={canvasRef} width={300} height={200} />;
};

export default Thumbnail;
