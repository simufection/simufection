import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const medicine = (state: GameState, params: ParamsModel) => {
  const virus = state.virus;
  virus.healProb = virus.healProb * params.MEDICINE_EFFECT;
  return virus;
};
