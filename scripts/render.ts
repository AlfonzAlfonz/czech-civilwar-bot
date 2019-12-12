import _fs from "fs";

import { initGame, step, getControllingFaction } from "../src/game";
import data from "../src/mapdata.json";
import { renderSvg } from "../src/svg";
import { Faction } from "../src/types";
import sharp from "sharp";

const fs = _fs.promises;

const months = [
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec"
];

// render svg, then convert it to png and save everything to folder
const render = (factions: Faction[], i: number, message?: string) =>
  renderSvg(factions).then(data => {
    fs.mkdir(`./render/${i}`).then(() => {
      fs.writeFile(`./render/${i}/map.svg`, data.toString());
      fs.writeFile(`./render/${i}/text.txt`, message);
      fs.writeFile(
        `./render/${i}/faction.json`,
        JSON.stringify(factions, null, 2)
      );
      sharp(Buffer.from(data.toString()))
        .resize(1600, 1200)
        .png()
        .toFile(`./render/${i}/map.png`);
    });
  });

const district = (i: number) =>
  i === 1 ? "okres" : i < 5 ? "okresy" : "okresů";

const main = async () => {
  const [regions, init] = initGame(data);
  !_fs.existsSync(`./render/`) && (await fs.mkdir(`./render/`));

  const getDate = (i: number) => {
    const start = new Date(2020, 0);
    const d = new Date(start.setMonth(start.getMonth() + i));
    return months[d.getMonth()] + " " + d.getFullYear();
  };

  // recursively render game until only one faction remains
  const renderStep = (factions: Faction[], i: number = 1) => {
    if (factions.length === 1) {
      // game ended
      render(factions, i + 1);
      return;
    }

    const result = step(regions, factions);
    // get faction of conquered region
    const diff = factions
      .filter(f => !result.factions.some(x => x.name === f.name))
      .map(f => f.name)[0];
    const conqueror = result.conqueror!;
    // get conquered region
    const region = getControllingFaction(init, result.region!)!;
    const conquered = result.conquered!;
    console.clear();
    console.log("rendering" + "".padEnd((i % 3) + 1, "."));
    console.log(getDate(i));
    // save step
    render(
      result.factions,
      i,
      `
${getDate(i)}, okres ${conqueror!.name} dobyl okres ${region.name} ${
        region.name !== conquered!.name
          ? `(dříve ovládaný okresem ${conquered!.name})`
          : ``
      }.

Okres ${conqueror.name} ovládá ${conqueror.territories.length + 1} území.
${
  diff
    ? `Okres ${diff} ztratil všechno území.`
    : `Okres ${conquered.name} ovládá ${conquered.territories.length -
        1} území.`
}

Zbývá ${result.factions.length} ${district(result.factions.length)}.
      `
    ).then(() => renderStep(result.factions, (i || 0) + 1));
  };

  console.log("rendering...");
  render(init, 0);
  renderStep(init);
};

main();
