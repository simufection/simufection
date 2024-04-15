import { initialize } from "next/dist/server/lib/render-server";
import { ParamsModel } from "@/app/_params/params";
import { allPrefs } from "@/app/_data/prefs";
import { Ball, infectionRate } from "@/app/_states/balls";

export type Pref = {
  isLockedDown: boolean;
  lockdownCompliance: number;
  updated: boolean;
  isPreview: boolean;
};

export const initializePrefs = (params: ParamsModel, prefIds: number[]) => {
  const pref: Pref = {
    isLockedDown: false,
    lockdownCompliance: params.LOCKDOWN_COMPLIANCE,
    updated: false,
    isPreview: false
  };
  let prefs: { [name: number]: Pref } = {};
  prefIds.forEach((prefId) => {
    prefs[prefId] = { ...pref };
  });

  return prefs;
};

export const updatePrefPreview = (currentPrefs: { [name: number]: Pref }, previewPrefs: number[]) => {
  const prefs = { ...currentPrefs }
  Object.keys(prefs).forEach((prefId) => {
    if (prefs[parseInt(prefId)].isPreview == true) {
      prefs[parseInt(prefId)].isPreview = false;
      prefs[parseInt(prefId)].updated = true;
    }
    if (previewPrefs.includes(0) || previewPrefs.includes(parseInt(prefId))) {
      prefs[parseInt(prefId)].isPreview = true;
      prefs[parseInt(prefId)].updated = true;
    }
  })
  return prefs
}

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
      infectionRate(balls, parseInt(prefId)) <
      params.INFECTION_RATE_LOCKDOWN_ENDS
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
