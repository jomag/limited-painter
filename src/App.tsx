import React, { useRef, useState, useEffect } from 'react';
import ToolBar from './ToolBar';
import ColorPicker from './ColorPicker';
import LimpaCanvas from './LimpaCanvas';
import './App.css';
import * as palettes from './palettes';
import nailedIt from './nailed-it';
import ImageProject from './Image';

const App = () => {
  const image = useRef<ImageProject>();
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(false);
  const [pixelAspectRatio, setPixelAspectRatio] = useState(1);
  const [revision, setRevision] = useState(0);
  const [palette] = useState(palettes.c64alt);
  const width = 160;
  const height = 200;

  useEffect(() => {
    image.current = ImageProject.createFromArray(160, 200, nailedIt);
  }, []);

  const setPixel = (x: number, y: number, colorIndex: number) => {
    if (image.current !== undefined) {
      image.current.pixels[y * width + x] = colorIndex;
    }
    console.log('setpixel');
    setRevision(revision + 1);
  };

  const handleWheel = (evt: React.WheelEvent) => {
    const dir = Math.sign(evt.deltaY);
    if (dir < 0 || zoom > 1) {
      setZoom(zoom - dir * zoom * 0.1);
    }
  };

  return (
    <div className="App">
      <div className="toolBarContainer">
        <ToolBar
          zoom={zoom}
          setZoom={setZoom}
          grid={grid}
          setGrid={setGrid}
          pixelAspectRatio={pixelAspectRatio}
          setPixelAspectRatio={setPixelAspectRatio}
        />
      </div>
      <div className="canvasContainer" onWheel={handleWheel}>
        {image.current && (
          <LimpaCanvas
            image={image.current}
            palette={palette}
            setPixel={setPixel}
            activeColorIndex={activeColorIndex}
            scaleX={zoom * pixelAspectRatio}
            scaleY={zoom}
            grid={grid && zoom > 4}
            revision={revision}
          />
        )}
      </div>
      <div className="colorPickerContainer">
        <ColorPicker
          palette={palette}
          active={activeColorIndex}
          setActive={setActiveColorIndex}
        />
      </div>
    </div>
  );
};

export default App;
