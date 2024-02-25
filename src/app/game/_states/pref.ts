import { initialize } from "next/dist/server/lib/render-server";

export type Pref = {
  isLockedDown: Boolean;
  turnLockdownEnds: number;
};

export const initializePrefs = () => {
  const pref: Pref = { isLockedDown: false, turnLockdownEnds: -1 };
  let prefs = [];
  for (let i = 0; i < 1000; i++) {
    prefs.push({ ...pref });
  }
  return prefs;
};

export const updatePrefs = (
  currentPrefs: Pref[],
  currentPrefsUpdated: number[],
  turn: number
) => {
  let prefs = [...currentPrefs];
  let prefsUpdated = [...currentPrefsUpdated];
  for (let i = 0; i < prefs.length; i++) {
    if (turn == prefs[i].turnLockdownEnds) {
      prefs[i].isLockedDown = false;
      prefsUpdated.push(i);
    }
  }
  return { prefs: prefs, prefsUpdated: prefsUpdated };
};
