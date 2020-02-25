import React from 'react';
import classNames from 'classnames/bind';

import { Tool, ToolType } from './tools';
import styles from './ToolPicker.module.css';

const cx = classNames.bind(styles);

type Props = {
  activeTool: ToolType;
  setActiveTool: (type: ToolType) => void;
};

type IconButtonProps = {
  name: string;
  icon: string;
  active: boolean;
  onClick: any;
};

const IconButton = ({ name, icon, active, onClick }: IconButtonProps) => (
  <div
    className={cx('iconButton', { active })}
    style={{ backgroundImage: icon }}
    onClick={onClick}
  />
);

const ToolPicker = ({ activeTool, setActiveTool }: Props) => {
  return (
    <div className={styles.toolPicker}>
      <IconButton
        name="Pen"
        icon="url(/img/pen-16.png)"
        active={activeTool === ToolType.PEN}
        onClick={() => setActiveTool(ToolType.PEN)}
      />

      <IconButton
        name="Line"
        icon="url(/img/line-16.png)"
        active={activeTool === ToolType.LINE}
        onClick={() => setActiveTool(ToolType.LINE)}
      />

      <IconButton
        name="Rectangle"
        icon="url(/img/rectangle-16.png)"
        active={activeTool === ToolType.RECTANGLE}
        onClick={() => setActiveTool(ToolType.RECTANGLE)}
      />
    </div>
  );
};

export default ToolPicker;
