import { initGame, step } from "../src/game";
import data from "../src/mapdata.json";
import { button, updateUI } from "../src/ui";

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("map.svg");
  const text = await res.text();

  let [regions, factions] = initGame(data);
  let log = [];

  const update = () => {
    const result = step(regions, factions);
    factions = result.factions;
    log.push(result.conqueror!.name + " => " + result.conquered!.name);
    updateUI(factions);
  };

  document.getElementById("map")!.innerHTML = text;
  updateUI(factions);

  button("next")(update);
  button("run")(() => setInterval(update, 100));
});
