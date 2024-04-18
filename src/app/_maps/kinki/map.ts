import { allPrefs } from "@/app/_data/prefs";
import { Map } from "@/app/_states/maps";
import { kinkiMapData } from "@/app/_maps/kinki/kinkiMapData";
import kinkiMapPreview from "@/assets/img/kinki_preview.png";

const kinkiPrefs = allPrefs.filter((p) => p.area == "近畿");
const kinkiPrefIds = kinkiPrefs.map((p) => p.id);
const totalPop = kinkiPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = kinkiPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const kinkiMap: Map = {
  map: kinkiMapData,
  prefIds: kinkiPrefIds,
  initialPrefs: [27],
  func: rand,
  preview: kinkiMapPreview,
};
