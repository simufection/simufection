import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const cureFaster = (state: GameState, params: ParamsModel) => {
  const virus = state.virus;
  virus.turnsRequiredForHeal = Math.floor(
    virus.turnsRequiredForHeal * params.CURE_FASTER_EFFECT
  );
  return virus;
};
