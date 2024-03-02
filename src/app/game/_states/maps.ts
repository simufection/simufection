import { StaticImageData } from "next/image";
import { tohokuMap } from "../_maps/tohoku/map";
import { kantoMap } from "../_maps/kanto/map";
import { chubuMap } from "../_maps/chubu/map";
import { kinkiMap } from "../_maps/kinki/map";
import { chugokuMap } from "../_maps/chugoku/map";
import { kyushuMap } from "../_maps/kyushu/map";

export type Map = {
  map: number[][];
  prefIds: number[];
  func: () => number | undefined;
  preview: StaticImageData;
};

export const maps: { [name: string]: Map } = {
  tohoku: tohokuMap,
  kanto: kantoMap,
  chubu: chubuMap,
  kinki: kinkiMap,
  chugoku: chugokuMap,
  kyushu: kyushuMap,
};
