import { Faction, MapData, Region } from "./types";

const getRandomItem = require("random-weighted-item").default as <T>(
  array: T[],
  func: (val: T) => number
) => T;

const randomItem = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];

// for each region create a faction
export const initGame = (data: MapData[]): [Region[], Faction[]] => [
  data.map(d => ({ id: d.id, adjacent: d.adjacent })),
  data.map(d => ({
    name: d.name,
    power: d.power,
    color: d.color,
    territories: [d.id]
  }))
];

export const factionPower = (faction: Faction) =>
  Math.log((faction.territories.length + 1) * faction.power) / Math.log(2);

// game step
export const step = (regions: Region[], factions: Faction[]) => {
  // do nothing if only one faction remains
  if (factions.length === 1) {
    return {
      factions
    };
  }
  // select conqueror
  const conqueror = getRandomItem(factions, f => factionPower(f) * f.power);

  // select region to conquer
  const region = randomItem(
    conqueror.territories
      .map(t => regions.find(r => r.id === t)!)
      .reduce((acc, val) => [...acc, ...val.adjacent], [] as number[])
      .filter(r => !conqueror.territories.includes(r))
  );

  return {
    conqueror,
    conquered: getControllingFaction(factions, region)!,
    region,
    factions: factions
      .map(f =>
        f.name === conqueror.name
          ? {
              ...f,
              // add region to conqueror
              territories: [...f.territories, region]
            }
          : {
              ...f,
              // remove region from any other faction
              territories: f.territories.filter(v => v !== region)
            }
      )
      .map(f => ({ ...f }))
      .filter(f => f.territories.length !== 0)
  };
};

// get faction controlling region
export const getControllingFaction = (factions: Faction[], id: number) =>
  factions.find(f => f.territories.includes(id));
