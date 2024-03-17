import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const vaccine = (state: GameState, params: ParamsModel) => {
  const virus = state.virus;
  virus.prob *= params.VACCINE_EFFECT;
  virus.turnsRequiredForHeal = Math.floor(
    virus.turnsRequiredForHeal * params.CURE_FASTER_EFFECT
  );
  return virus;
};
