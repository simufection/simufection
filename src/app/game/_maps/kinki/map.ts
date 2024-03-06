import { prefs } from "../../_data/prefs";
import { Map } from "../../_states/maps";
import { kinkiMapData } from "./kinkiMapData";
import kinkiMapPreview from "../../../../assets/img/kinki_preview.png";

const kinkiPrefs = prefs.filter((p) => p.area == "近畿");
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
  func: rand,
  preview: kinkiMapPreview,
};
