import { prefs } from "../../_data/prefs";
import { Map } from "../../_states/maps";
import { kantoMapData } from "./kantoMapData";
import { get_prefCoordinates } from "../../_functions/_map/get_prefCorrdinates";

const kantoPrefs = prefs.filter((p) => p.area == "関東");
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
  prefCoordinates: get_prefCoordinates(kantoMapData),
  func: rand,
};
