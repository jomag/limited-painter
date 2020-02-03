import React, { useRef, useState } from 'react';
import ToolBar from './ToolBar';
import ColorPicker from './ColorPicker';
import LimpaCanvas from './LimpaCanvas';
import './App.css';
import * as palettes from './palettes';
import nailedIt from './nailed-it';

const App = () => {
  const pixels = useRef(nailedIt);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(false);
  const [pixelAspectRatio, setPixelAspectRatio] = useState(1);
  const [revision, setRevision] = useState(0);
  const [palette] = useState(palettes.c64alt);
  const width = 160;
  const height = 200;

  const setPixel = (x: number, y: number, colorIndex: number) => {
    pixels.current[y * width + x] = colorIndex;
    console.log('setpixel');
    setRevision(revision + 1);
  };

  const handleWheel = (evt: React.WheelEvent) => {
    const dir = Math.sign(evt.deltaY);
    if (dir < 0 || zoom > 1) {
      setZoom(zoom - dir);
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
        <LimpaCanvas
          pixels={pixels.current}
          width={width}
          height={height}
          palette={palette}
          setPixel={setPixel}
          activeColorIndex={activeColorIndex}
          scaleX={zoom * pixelAspectRatio}
          scaleY={zoom}
          grid={grid && zoom > 4}
          revision={revision}
        />
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
