import { prefs } from "../../_data/prefs";
import { Map } from "../../_states/maps";
import { shikokuMapData } from "./shikokuMapData";
import shikokuMapPreview from "../../../../assets/img/shikoku_preview.png";

const shikokuPrefs = prefs.filter(
  (p) => p.area == "四国" && p.name != "沖縄県"
);
const shikokuPrefIds = shikokuPrefs.map((p) => p.id);
const totalPop = shikokuPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = shikokuPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const shikokuMap: Map = {
  map: shikokuMapData,
  prefIds: shikokuPrefIds,
  func: rand,
  preview: shikokuMapPreview,
};
