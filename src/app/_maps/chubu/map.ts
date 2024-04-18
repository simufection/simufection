import { Map } from "@/app/_states/maps";
import { chubuMapData } from "@/app/_maps/chubu/chubuMapData";
import chubuMapPreview from "@/assets/img/chubu_preview.png";
import { allPrefs } from "@/app/_data/prefs";

const chubuPrefs = allPrefs.filter((p) => p.area == "中部");
const chubuPrefIds = chubuPrefs.map((p) => p.id);
const totalPop = chubuPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = chubuPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const chubuMap: Map = {
  map: chubuMapData,
  prefIds: chubuPrefIds,
  // initialPrefs: chubuPrefIds,
  initialPrefs: [23],
  func: rand,
  preview: chubuMapPreview,
};
