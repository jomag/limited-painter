import React from 'react';
import classNames from 'classnames/bind';

import { Tool } from './tools';
import styles from './ToolPicker.module.css';

const cx = classNames.bind(styles);

type Props = {
  tools: Tool[];
  active: Tool;
  setActive: (tool: Tool) => void;
};

const ToolPicker = ({ tools, active, setActive }: Props) => {
  return (
    <div className={styles.toolPicker}>
      {tools.map((tool, index) => (
        <div
          key={index}
          className={cx({ active: active === tool })}
          onClick={e => {
            e.stopPropagation();
            setActive(tool);
          }}
        >
          {tool.name}
        </div>
      ))}
    </div>
  );
};

export default ToolPicker;
