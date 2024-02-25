import { initialize } from "next/dist/server/lib/render-server";

export type Pref = {
  isLockedDown: Boolean;
};

export const initializePrefs = () => {
  const pref: Pref = { isLockedDown: false };
  let prefs = [];
  for (let i = 0; i < 1000; ++i) {
    prefs.push({ ...pref });
  }
  return prefs;
};
