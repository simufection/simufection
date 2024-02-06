import { EFFECT_PARAMS } from "../../_params/policyParams";
import { GameState } from "../../_states/state";

export const vaccine = (state: GameState) => {
  const virus = state.virus;
  virus.prob *= EFFECT_PARAMS.VACCINE_EFFECT;
  return virus;
};
