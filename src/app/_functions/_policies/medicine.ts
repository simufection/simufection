import { ParamsModel } from "@/app/_params/params";
import { GameState } from "@/app/_states/state";

export const medicine = (state: GameState, params: ParamsModel) => {
  const virus = state.virus;
  virus.healProb = virus.healProb * params.MEDICINE_EFFECT;
  return virus;
};
