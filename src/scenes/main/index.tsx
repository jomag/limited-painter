import React, { useState, useRef, useEffect } from "react";

import ToolBar from "../../ToolBar";
import ColorPicker from "../../ColorPicker";
import ToolPicker from "../../ToolPicker";
import BrushPicker from "./components/BrushPicker";
import LimpaCanvas from "../../LimpaCanvas";
import ImageProject from "../../Image";
import { Tool } from "../../tools";
import PenTool from "../../tools/PenTool";
import LineTool from "../../tools/LineTool";
import { saveImage } from "../../storage";
import { RectangleTool } from "../../tools/RectangleTool";
import styles from "./index.module.css";
import { ToolType } from "../../tools";
import { Brush, BrushShape } from "../../brush";

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
  const tools = useRef<{ [type in ToolType]: Tool }>({
    [ToolType.PEN]: new PenTool(1),
    [ToolType.LINE]: new LineTool(),
    [ToolType.RECTANGLE]: new RectangleTool()
  });
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.PEN);
  const [brushSize, setBrushSize] = useState<number>(3);
  const [brushShape, setBrushShape] = useState<BrushShape>(BrushShape.ROUND);

  const setActiveColorIndex = (index: number) => {
    for (const tool of Object.values(tools)) {
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
      <div className={styles.toolBarContainer}>
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

      <div className={styles.mainArea}>
        <div className={styles.canvasContainer} onWheel={handleWheel}>
          {image && (
            <LimpaCanvas
              image={image}
              scaleX={zoom * pixelAspectRatio}
              scaleY={zoom}
              grid={grid && zoom > 4}
              tool={tools.current[activeTool]}
              brush={{ shape: brushShape, size: brushSize }}
            />
          )}
        </div>

        <div>
          <ToolPicker activeTool={activeTool} setActiveTool={setActiveTool} />
          <BrushPicker
            brush={{ shape: brushShape, size: brushSize }}
            setBrush={(brush: Brush) => {
              setBrushShape(brush.shape);
              setBrushSize(brush.size);
            }}
          />
        </div>
      </div>

      <div className={styles.colorPickerContainer}>
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
