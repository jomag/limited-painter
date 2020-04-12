import React, { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './BrushPicker.module.css';
import { Brush, BrushShape } from '../../../brush';

const cx = classNames.bind(styles);

type Props = {
  brush: Brush;
  setBrush: (brush: Brush) => void;
};

const BrushPicker = ({ brush, setBrush }: Props) => {
  const brushes = [
    [
      { shape: BrushShape.ROUND, size: 1, name: 'round1' },
      { shape: BrushShape.ROUND, size: 2, name: 'round2' },
      { shape: BrushShape.ROUND, size: 3, name: 'round3' },
    ],
    [
      { shape: BrushShape.SQUARE, size: 1, name: 'square1' },
      { shape: BrushShape.SQUARE, size: 2, name: 'square2' },
      { shape: BrushShape.SQUARE, size: 3, name: 'square3' },
    ],
  ];

  return (
    <div>
      {brushes.map(row => (
        <div className={styles.brushPicker}>
          {row.map(b => (
            <div
              className={cx('brush', {
                active: b.size === brush.size && b.shape === brush.shape,
              })}
              onClick={() => setBrush(b)}
            >
              <img src={`/img/brushes/${b.name}.png`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BrushPicker;
