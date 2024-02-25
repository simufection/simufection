import { GameState } from "../../_states/state";
import { ParamsModel } from "../../_params/params";


export const lockdown = (
  state: GameState,
  prefId: number,
) => {
  let prefs = state.prefs;
  prefs[prefId].isLockedDown = true;
  return prefs;
};
