export default interface IPixelBuffer {
  setPixel: (x: number, y: number, colorIndex: number) => void;
  getPixel: (x: number, y: number) => number | undefined;
}
