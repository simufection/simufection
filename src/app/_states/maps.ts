import { StaticImageData } from "next/image";
import { tohokuMap } from "@/app/_maps/tohoku/map";
import { kantoMap } from "@/app/_maps/kanto/map";
import { chubuMap } from "@/app/_maps/chubu/map";
import { kinkiMap } from "@/app/_maps/kinki/map";
import { chugokuMap } from "@/app/_maps/chugoku/map";
import { shikokuMap } from "@/app/_maps/shikoku/map";
import { kyushuMap } from "@/app/_maps/kyushu/map";

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
  shikoku: shikokuMap,
  kyushu: kyushuMap,
};
