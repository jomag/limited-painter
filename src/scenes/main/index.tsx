import React, { useState, useRef, useEffect } from 'react';

import ToolBar from '../../ToolBar';
import ColorPicker from '../../ColorPicker';
import ToolPicker from '../../ToolPicker';
import LimpaCanvas from '../../LimpaCanvas';
import ImageProject from '../../Image';
import { Tool } from '../../tools';
import PenTool from '../../tools/PenTool';
import LineTool from '../../tools/LineTool';
import { saveImage } from '../../storage';
import { RectangleTool } from '../../tools/RectangleTool';

type Props = {
  image: ImageProject;
  close: any; // FIXME: correct type
  uri: string;
};

const MainScene = ({ image, close, uri }: Props) => {
  const [activeColorIndex, _setActiveColorIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(false);
  const [pixelAspectRatio, setPixelAspectRatio] = useState(1);
  const [tools] = useState<Tool[]>([
    new PenTool(1),
    new PenTool(2),
    new PenTool(3),
    new LineTool(),
    new RectangleTool(),
  ]);
  const [activeTool, setActiveTool] = useState(tools[0]);

  const setActiveColorIndex = (index: number) => {
    for (const tool of tools) {
      tool.setForeground(index);
    }
    _setActiveColorIndex(index);
  };

  const handleWheel = (evt: React.WheelEvent) => {
    const dir = Math.sign(evt.deltaY);
    if (dir < 0 || zoom > 1) {
      setZoom(zoom - dir * zoom * 0.1);
    }
  };

  const save = () => {
    saveImage(image, uri);
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
          close={close}
          save={save}
        />
      </div>
      <div className="toolBarContainer">
        <ToolPicker
          tools={tools}
          active={activeTool}
          setActive={setActiveTool}
        />
      </div>
      <div className="canvasContainer" onWheel={handleWheel}>
        {image && (
          <LimpaCanvas
            image={image}
            scaleX={zoom * pixelAspectRatio}
            scaleY={zoom}
            grid={grid && zoom > 4}
            tool={activeTool}
          />
        )}
      </div>
      <div className="colorPickerContainer">
        <ColorPicker
          palette={image.palette}
          active={activeColorIndex}
          setActive={setActiveColorIndex}
        />
      </div>
    </div>
  );
};

export default MainScene;
