import { prefs } from "../../_data/prefs";
import { Map } from "../../_states/maps";
import { kantoMapData } from "./kantoMapData";

const kantoPrefs = prefs.filter((p) => p.area == "関東");
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
  func: rand,
};
