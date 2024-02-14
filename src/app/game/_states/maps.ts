import { kantoMap } from "../_maps/kanto/map";

export type Map = {
  map: number[][];
  func: () => number | undefined;
};

export const maps: { [name: string]: Map } = { kanto: kantoMap };
