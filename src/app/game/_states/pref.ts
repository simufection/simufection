import { initialize } from "next/dist/server/lib/render-server";
import { ParamsModel } from "../_params/params";
import { allPrefs } from "../_data/prefs";

export type Pref = {
  isLockedDown: boolean;
  turnLockdownEnds: number;
  lockdownCompliance: number;
  updated: boolean;
};

export const initializePrefs = (params: ParamsModel, prefIds: number[]) => {
  const pref: Pref = {
    isLockedDown: false,
    turnLockdownEnds: -1,
    lockdownCompliance: params.LOCKDOWN_COMPLIANCE,
    updated: false,
  };
  let prefs: { [name: number]: Pref } = {};
  prefIds.forEach((prefId) => {
    prefs[prefId] = { ...pref };
  });

  return prefs;
};

export const updatePrefs = (
  params: ParamsModel,
  currentPrefs: { [name: number]: Pref },
  turns: number
) => {
  let prefs = { ...currentPrefs };
  const prefsEvents = [];
  for (let prefId in prefs) {
    if (turns == prefs[prefId].turnLockdownEnds) {
      prefs[prefId].isLockedDown = false;
      prefs[prefId].lockdownCompliance *= params.LOCKDOWN_COMPLIANCE_RATE;
      prefs[prefId].updated = true;
      prefsEvents.push(
        `ロックダウン解除！${
          allPrefs.filter((p) => p.id == parseInt(prefId))[0].name
        }に自由に出入りできるようになりました`
      );
    }
  }
  return { prefs: prefs, prefsEvents: prefsEvents };
};
