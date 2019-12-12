import fs from "fs";

// generate empty map data

const randomByte = () => 20 + Math.round(Math.random() * 235);

const createItem = (i: number) => ({
  id: i + 1,
  name: "1",
  power: 1,
  adjacent: [],
  color: `rgb(${randomByte()},${randomByte()},${randomByte()})`
});

// czech republic has 76 regions
const data = [...Array(76)].map((_, i) => createItem(i));

if (!fs.existsSync("./src/mapdata.json")) {
  fs.writeFileSync("./src/mapdata.json", JSON.stringify(data, null, 2));
} else {
  console.error("map data file already exists!");
  process.exit(1);
}
