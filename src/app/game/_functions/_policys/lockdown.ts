import { GameState } from "../../_states/state";
import { ParamsModel } from "../../_params/params";

export const lockdown = (state: GameState, prefId: number) => {
  let prefs = state.prefs;
  let prefsUpdated = state.prefsUpdated;
  prefs[prefId].isLockedDown = true;
  prefsUpdated.push(prefId);
  return { new_prefs: prefs, prefsUpdated: prefsUpdated };
};
