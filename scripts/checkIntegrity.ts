import mapdata from "../src/mapdata.json";
import { MapData } from "../src/types";

// check integrity of mapdata

let counter = 0;

(mapdata as MapData[]).map(x => {
  x.adjacent.map(a => {
    const region = mapdata.find(y => y.id === a)!;
    if (!region.adjacent.includes(x.id)) {
      console.log("ERROR 1 - region neighbour adjacent regions doesn't contain current region");
      console.log(x, region);
      counter++;
    }
  });
  if (x.adjacent.find(y => y > 77)) {
    console.log("ERROR 2 - region ");
    console.log(x);
  }
});

console.log(counter);
