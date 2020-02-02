import React, { useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import LimpaCanvas from "./LimpaCanvas";
import "./App.css";
import * as palettes from "./palettes";
import nailedIt from "./nailed-it";

const smiley = [
  "00111100",
  "01111110",
  "11211211",
  "11211211",
  "11111111",
  "12111121",
  "01222210",
  "00111100"
]
  .join("")
  .split("")
  .map(n => parseInt(n, 16));

const App = () => {
  const pixels = useRef(nailedIt);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [scaleX, setScaleX] = useState(20);
  const [scaleY, setScaleY] = useState(10);
  const [revision, setRevision] = useState(0);
  const [palette] = useState(palettes.c64alt);
  const width = 160;
  const height = 200;

  const setPixel = (x: number, y: number, colorIndex: number) => {
    pixels.current[y * width + x] = colorIndex;
    console.log("setpixel");
    setRevision(revision + 1);
  };

  const handleWheel = (evt: React.WheelEvent) => {
    const dir = Math.sign(evt.deltaY);
    if (dir < 0 || (scaleX > 1 && scaleY > 1)) {
      setScaleY(scaleY - dir);
      setScaleX((scaleY - dir) * 2);
    }
  };

  return (
    <div className="App">
      <div className="canvasContainer" onWheel={handleWheel}>
        <LimpaCanvas
          pixels={pixels.current}
          width={width}
          height={height}
          palette={palette}
          setPixel={setPixel}
          activeColorIndex={activeColorIndex}
          scaleX={scaleX}
          scaleY={scaleY}
          grid={scaleX > 5 && scaleY > 5}
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
