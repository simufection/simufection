import { allPrefs } from "@/app/_data/prefs";
import { Map } from "@/app/_states/maps";
import { kantoMapData } from "@/app/_maps/kanto/kantoMapData";
import kantoMapPreview from "@/assets/img/kanto_preview.png";

const kantoPrefs = allPrefs.filter((p) => p.area == "関東");
const kantoPrefIds = kantoPrefs.map((p) => p.id);
const totalPop = kantoPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = kantoPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const kantoMap: Map = {
  map: kantoMapData,
  prefIds: kantoPrefIds,
  initialPrefs: [11, 12, 14],
  func: rand,
  preview: kantoMapPreview,
};
