import { kantoMap } from "../_maps/kanto/map";
import { kyushuMap } from "../_maps/kyushu/map";

export type Map = {
  map: number[][];
  prefIds: number[];
  func: () => number | undefined;
};

export const maps: { [name: string]: Map } = {
  kanto: kantoMap,
  kyushu: kyushuMap,
};
