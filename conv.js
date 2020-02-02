const fs = require("fs");
const pngjs = require("pngjs");

const img = new pngjs.PNG({ filterType: 4 });

const colors = {};

const colorIndex = {
  "80, 80, 80": 12,
  "bb, 77, 6d": 10,
  "ab, ab, ab": 15,
  "7a, bf, c7": 3,
  "d0, dc, 71": 7,
  "ff, ff, ff": 1,
  "68, a9, 41": 5,
  "54, 54, 54": 11,
  "3e, 31, a2": 6,
  "90, 5f, 25": 8,
  "0, 0, 0": 0,
  "57, 42, 0": 9,
  "ac, ea, 88": 13,
  "7c, 70, da": 14,
  "8c, 3e, 34": 2,
  "8d, 47, b3": 4
};

fs.createReadStream("nailed-it.png")
  .pipe(img)
  .on("parsed", () => {
    console.log("Width: ", img.width);
    console.log("Height: ", img.height);

    for (let i = 0; i < img.width * img.height * 4; i += 4) {
      const r = img.data[i];
      const g = img.data[i + 1];
      const b = img.data[i + 2];
      colors[`${r.toString(16)}, ${g.toString(16)}, ${b.toString(16)}`] = true;
    }

    console.log("Found colors: ", Object.keys(colors));

    const v = [];

    for (let i = 0; i < img.width * img.height * 4; i += 4) {
      const r = img.data[i];
      const g = img.data[i + 1];
      const b = img.data[i + 2];
      const idx =
        colorIndex[`${r.toString(16)}, ${g.toString(16)}, ${b.toString(16)}`];
      v.push(idx);
    }

    console.log(JSON.stringify(v, null, 2));
  });
