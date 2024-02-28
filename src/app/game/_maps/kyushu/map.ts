import { prefs } from "../../_data/prefs";
import { Map } from "../../_states/maps";
import { kyushuMapData } from "./kyushuMapData";
import { get_prefCoordinates } from "../../_functions/_map/get_prefCorrdinates";

const kyushuPrefs = prefs.filter((p) => p.area == "九州" && p.name != "沖縄県");
const kyushuPrefIds = kyushuPrefs.map((p) => p.id);
const totalPop = kyushuPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = kyushuPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const kyushuMap: Map = {
  map: kyushuMapData,
  prefIds: kyushuPrefIds,
  func: rand,
};
