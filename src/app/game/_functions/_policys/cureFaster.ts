import { EFFECT_PARAMS } from "../../_params/policyParams";
import { GameState } from "../../_states/state";

export const cureFaster = (state: GameState) => {
  const virus = state.virus;
  virus.turnsRequiredForHeal = Math.floor(
    virus.turnsRequiredForHeal * EFFECT_PARAMS.CURE_FASTER_EFFECT
  );
  return virus;
};
