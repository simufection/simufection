import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const medicine = (state: GameState, params: ParamsModel) => {
  const virus = state.virus;
  virus.HEAL_PROB = virus.HEAL_PROB * params.MEDICINE_EFFECT;
  return virus;
};
