import { allPrefs } from "@/app/_data/prefs";
import { Map } from "@/app/_states/maps";
import { tutorialMapData } from "@/app/_maps/tutorial/tutorialMapData";
import tutorialMapPreview from "@/assets/img/tutorial_preview.png";

const tutorialPrefs = allPrefs.filter((p) => p.area == "チュートリアル");
const tutorialPrefIds = tutorialPrefs.map((p) => p.id);
const totalPop = tutorialPrefs.reduce(
  (sum, { population }) => sum + population,
  0
);

function rand() {
  let cumulativeProb = 0;
  const cumulative = tutorialPrefs.map((p) => {
    cumulativeProb += p.population / totalPop;
    return { id: p.id, cumulativeProb };
  });

  const rand = Math.random();

  const selected = cumulative.find((p) => rand <= p.cumulativeProb);

  return selected?.id;
}

export const tutorialMap: Map = {
  map: tutorialMapData,
  prefIds: tutorialPrefIds,
  func: rand,
  preview: tutorialMapPreview,
};
