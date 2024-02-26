import { initialize } from "next/dist/server/lib/render-server";
import { ParamsModel } from "../_params/params";

export type Pref = {
  isLockedDown: Boolean;
  turnLockdownEnds: number;
  lockdownCompliance: number;
};

export const initializePrefs = (params: ParamsModel) => {
  const pref: Pref = {
    isLockedDown: false,
    turnLockdownEnds: -1,
    lockdownCompliance: params.LOCKDOWN_COMPLIANCE,
  };
  let prefs = [];
  for (let i = 0; i < 1000; i++) {
    prefs.push({ ...pref });
  }
  return prefs;
};

export const updatePrefs = (
  params: ParamsModel,
  currentPrefs: Pref[],
  currentPrefsUpdated: number[],
  turn: number
) => {
  let prefs = [...currentPrefs];
  let prefsUpdated = [...currentPrefsUpdated];
  for (let i = 0; i < prefs.length; i++) {
    if (turn == prefs[i].turnLockdownEnds) {
      prefs[i].isLockedDown = false;
      prefs[i].lockdownCompliance *= params.LOCKDOWN_COMPLIANCE_RATE;
      prefsUpdated.push(i);
    }
  }
  return { prefs: prefs, prefsUpdated: prefsUpdated };
};
