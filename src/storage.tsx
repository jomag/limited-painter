import ImageProject from './Image';
import nailedIt from './nailed-it';

export const saveImage = async (image: ImageProject, uri: string) => {
  const url = new URL(uri);

  const serialized = image.toJson();

  switch (url.protocol) {
    case 'local:':
      return localStorage.setItem(
        `image.${url.pathname}`,
        JSON.stringify(serialized),
      );

    default:
      throw new Error(`Invalid protocol: ${url.protocol}`);
  }
};

export const loadImage = (uri: string) => {
  const url = new URL(uri);

  switch (url.protocol) {
    case 'local:': {
      const item = localStorage.getItem(`image.${url.pathname}`);
      if (item) {
        console.log(item);
        return ImageProject.createFromJson(JSON.parse(item));
      } else {
        throw new Error(
          `Failed to load ${uri} image.${url.pathname} from local storage`,
        );
      }
    }

    default:
      throw new Error(`Invalid protocol: ${url.protocol}`);
  }
};

export const getLocalStorageUris = () => {
  let n = 0;
  const uris = [];

  while (true) {
    const key = localStorage.key(n);

    if (!key) {
      break;
    }

    if (key?.startsWith('image.')) {
      uris.push(`local:${key.slice(6)}`);
    }

    n = n + 1;
  }

  return uris;
};

export const prepareLocalStorage = (): boolean => {
  const prevVersion = localStorage.getItem('version');

  if (!prevVersion) {
    localStorage.setItem('version', '0.0.0');
    return true;
  }

  return false;
};
