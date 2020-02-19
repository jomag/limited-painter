import React from 'react';
import styles from './ToolBar.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type Props = {
  zoom: number;
  setZoom: (zoom: number) => void;
  grid: boolean;
  setGrid: (visible: boolean) => void;
  pixelAspectRatio: number;
  setPixelAspectRatio: (ratio: number) => void;
  close: any; // FIXME: correct type
  save: any; //FIXME: correct type
};

type ToolBarButtonProps = {
  active?: boolean;
  onClick: () => void;
  children: any;
};

const ToolBarButton = ({ active, onClick, children }: ToolBarButtonProps) => {
  return (
    <div
      className={cx('toolBarButton', { active })}
      onClick={ev => {
        ev.stopPropagation();
        onClick();
      }}
    >
      {children}
    </div>
  );
};

const ToolBar = (props: Props) => {
  const nextAspect = props.pixelAspectRatio === 1 ? 2 : 1;

  const { zoom, setZoom, grid, setGrid, close, save } = props;

  return (
    <div className={styles.toolBar}>
      <ToolBarButton onClick={close}>Close</ToolBarButton>
      <ToolBarButton onClick={save}>Save</ToolBarButton>

      <ToolBarButton active={zoom === 1} onClick={() => setZoom(1)}>
        1:1
      </ToolBarButton>

      <ToolBarButton active={zoom === 2} onClick={() => setZoom(2)}>
        1:2
      </ToolBarButton>

      <ToolBarButton active={zoom === 4} onClick={() => setZoom(4)}>
        1:4
      </ToolBarButton>

      <ToolBarButton active={zoom === 8} onClick={() => setZoom(8)}>
        1:8
      </ToolBarButton>

      <ToolBarButton active={grid} onClick={() => setGrid(!grid)}>
        Grid
      </ToolBarButton>
      <ToolBarButton onClick={() => props.setPixelAspectRatio(nextAspect)}>
        Toggle 2:1 pixels
      </ToolBarButton>
    </div>
  );
};

export default ToolBar;
