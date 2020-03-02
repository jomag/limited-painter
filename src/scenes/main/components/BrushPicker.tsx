import React from "react";
import styles from "./BrushPicker.module.css";
import { Brush, BrushShape } from "../../../brush";

type Props = {
  brush: Brush;
  setBrush: (brush: Brush) => void;
};

const BrushPicker = ({ brush, setBrush }: Props) => {
  return (
    <div className={styles.brushPicker}>
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
