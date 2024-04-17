import { allPrefs } from "@/app/_data/prefs";
import { Map } from "@/app/_states/maps";
import { tohokuMapData } from "@/app/_maps/tohoku/tohokuMapData";
import tohokuMapPreview from "@/assets/img/tohoku_preview.png";

const tohokuPrefs = allPrefs.filter((p) => p.area == "東北");
const tohokuPrefIds = tohokuPrefs.map((p) => p.id);
const totalPop = tohokuPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = tohokuPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const tohokuMap: Map = {
  map: tohokuMapData,
  prefIds: tohokuPrefIds,
  initialPrefs: tohokuPrefIds,
  func: rand,
  preview: tohokuMapPreview,
};
