import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const vaccine = (state: GameState, params: ParamsModel) => {
  console.log("vaccine policy is called.");
  const virus = state.virus;
  virus.prob *= params.VACCINE_EFFECT;
  return virus;
};
