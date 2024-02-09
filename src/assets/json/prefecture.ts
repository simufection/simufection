import { gunma } from "./gunma";
import { ibaragi } from "./ibaragi";
import { tochigi } from "./tochigi";

type Pref = {
  [pref: string]: [number, number][];
};

export const prefecturePixel: Pref = {
  Tochigi: tochigi,
  Gunma: gunma,
  Ibaragi: ibaragi,
};
