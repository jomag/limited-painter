import React, { useEffect, useReducer, useState } from 'react';
import ImageProject from './Image';
import WelcomeScene from './scenes/welcome';
import MainScene from './scenes/main';
import { prepareLocalStorage, saveImage, loadImage } from './storage';

import nailedIt from './nailed-it';
import './App.css';
import './variables.css';

const App = () => {
  // Force rerender when local storage is updated
  // eslint-disable-next-line
  const [localStorageUpdates, localStorageUpdate] = useReducer(x => x + 1, 0);
  const [image, setImage] = useState<ImageProject>();
  const [imageUri, setImageUri] = useState<string>();

  useEffect(() => {
    if (prepareLocalStorage()) {
      const example1 = ImageProject.createFromArray(160, 200, nailedIt);
      saveImage(example1, 'local:example-nailed-it').then(() =>
        localStorageUpdate(),
      );

      saveImage(example1, 'local:example-nailed-it-again').then(() =>
        localStorageUpdate(),
      );

      saveImage(example1, 'local:example-nailed-it-finally').then(() =>
        localStorageUpdate(),
      );
    }
  }, []);

  const open = (uri: string) => {
    const img = loadImage(uri);
    setImage(img);
    setImageUri(uri);
  };

  if (image && imageUri) {
    return (
      <MainScene
        uri={imageUri}
        image={image}
        close={() => setImage(undefined)}
      />
    );
  } else {
    return <WelcomeScene open={open} />;
  }
};

export default App;
