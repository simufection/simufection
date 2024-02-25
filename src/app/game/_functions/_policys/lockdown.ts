import { GameState } from "../../_states/state";
import { ParamsModel } from "../../_params/params";

export const lockdown = (
  state: GameState,
  params: ParamsModel,
  prefId: number,
  turn: number
) => {
  let prefs = [...state.prefs];
  let prefsUpdated = [...state.prefsUpdated];
  prefs[prefId].isLockedDown = true;
  prefs[prefId].turnLockdownEnds = turn + params.TURNS_LOCKDOWN_PERSISTS;
  prefsUpdated.push(prefId);
  return { newPrefs: prefs, prefsUpdated: prefsUpdated };
};
