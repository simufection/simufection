import { GameState } from "@/app/_states/state";
import { ParamsModel } from "@/app/_params/params";

export const lockdown = (
  state: GameState,
  params: ParamsModel,
  prefId: number,
  turns: number
) => {
  let prefs = { ...state.prefs };
  prefs[prefId].isLockedDown = true;
  prefs[prefId].updated = true;
  return { newPrefs: prefs };
};
