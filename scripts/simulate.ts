import readline from "readline";

import { initGame, step } from "../src/game";
import data from "../src/mapdata.json";
import { MapData } from "../src/types";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

console.log("Sample size:");

rl.on("line", i => {
  if (parseInt(i, 10)) {
    test(parseInt(i, 10), data);
  } else {
    console.error("invalid input");
    process.exit(1);
  }
});

const test = (samplesize: number, data: MapData[]) => {
  const [regions, factions] = initGame(data);
  const results: Record<string, number> = {};

  [...Array(samplesize)].map((_, i) => {
    let f = [...factions];
    while (f.length !== 1) {
      f = step(regions, f).factions;
    }
    console.log(i, f[0].name);
    results[f[0].name] = (results[f[0].name] || 0) + 1;
  });

  const sorted = Object.keys(results)
    .sort((a, b) => results[b] - results[a])
    .map(k => k + "(" + results[k] + ")")
    .join("\n");

  console.log(sorted);
  rl.close();
};
