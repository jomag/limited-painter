import React from "react";
import { Color } from "./LimpaCanvas";
import styles from "./ColorPicker.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type Props = {
  palette: Color[];
  active: number;
  setActive: (index: number) => void;
};

const ColorPicker = ({ palette, active, setActive }: Props) => {
  return (
    <div className={styles["colorPicker"]}>
      {palette.map((color, index) => (
        <div
          key={index}
          className={cx({ active: active === index })}
          style={{
            backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]}`
          }}
          onClick={e => {
            e.stopPropagation();
            setActive(index);
          }}
        >
          {index}
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
