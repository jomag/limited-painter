import React, { useState, useEffect } from 'react';
import ImageProject from '../../../Image';
import Thumbnail from '../../../components/Thumbnail';
import { getLocalStorageUris, loadImage } from '../../../storage';

type Props = {
  open: any; // FIXME: correct type
};

const LocalStorageGallery = ({ open }: Props) => {
  const [images, setImages] = useState<{ [uri: string]: ImageProject }>({});

  useEffect(() => {
    const uris = getLocalStorageUris();
    const list: { [uri: string]: ImageProject } = {};
    for (const uri of uris) {
      list[uri] = loadImage(uri);
    }
    setImages(list);
  }, []);

  return (
    <div>
      <h2>Local Storage</h2>
      <div>
        <ul>
          {Object.keys(images).map(uri => (
            <div key={uri} onClick={() => open(uri)}>
              <Thumbnail image={images[uri]} />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LocalStorageGallery;
