export interface MapData {
  id: number;
  name: string;
  power: number;
  adjacent: number[];
  color: string;
}

export interface Region {
  id: number;
  adjacent: number[];
}

export interface Faction {
  name: string;
  power: number;
  color: string;
  territories: number[];
}
