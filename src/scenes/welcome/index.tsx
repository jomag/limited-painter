import React from 'react';
import styles from './index.module.css';
import Sidebar from './components/sidebar';
import LocalStorageGallery from './components/LocalStorageGallery';

type Props = {
  open: any; // FIXME: correct type
};

const Welcome = ({ open }: Props) => {
  return (
    <div className={styles.root}>
      <Sidebar />
      <div>
        <LocalStorageGallery open={open} />
      </div>
    </div>
  );
};

export default Welcome;
