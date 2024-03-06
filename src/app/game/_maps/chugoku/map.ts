import { prefs } from "../../_data/prefs";
import { Map } from "../../_states/maps";
import { chugokuMapData } from "./chugokuMapData";
import chugokuMapPreview from "../../../../assets/img/chugoku_preview.png";

const chugokuPrefs = prefs.filter((p) => p.area == "中国");
const chugokuPrefIds = chugokuPrefs.map((p) => p.id);
const totalPop = chugokuPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = chugokuPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const chugokuMap: Map = {
  map: chugokuMapData,
  prefIds: chugokuPrefIds,
  func: rand,
  preview: chugokuMapPreview,
};