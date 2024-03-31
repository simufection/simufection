import { initialize } from "next/dist/server/lib/render-server";
import { ParamsModel } from "../_params/params";
import { allPrefs } from "../_data/prefs";
import { Ball, infectionRate } from "./balls";

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
  balls: Ball[],
  turns: number
) => {
  let prefs = { ...currentPrefs };
  const prefsEvents: [number, string, any][] = [];
  for (let prefId in prefs) {
    if (
      prefs[prefId].isLockedDown &&
      infectionRate(balls, parseInt(prefId)) < params.INFECTION_RATE_LOCKDOWN_ENDS
    ) {
      prefs[prefId].isLockedDown = false;
      prefs[prefId].lockdownCompliance *= params.LOCKDOWN_COMPLIANCE_RATE;
      prefs[prefId].updated = true;
      prefsEvents.push([
        turns,
        "lockdown_end",
        {
          name: allPrefs.filter((p) => p.id == parseInt(prefId))[0].name,
        },
      ]);
    }
  }
  return { prefs: prefs, prefsEvents: prefsEvents };
};
