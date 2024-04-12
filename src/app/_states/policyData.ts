import { initialize } from "next/dist/server/lib/render-server";
import { ParamsModel } from "@/app/_params/params";
import { allPrefs } from "@/app/_data/prefs";
import { Ball, infectionRate } from "@/app/_states/balls";
import { policies } from "@/app/_functions/_policies/policies";

export type PolicyData = {
  [key: string]: { cost: number; [param: string]: any };
};

export const initializePolicydata = (params: ParamsModel) => {
  const data: PolicyData = {};
  policies(params).forEach((p) => {
    data[p.key] = { cost: p.initPoint };
  });
  return data;
};

export const updateLockdown = (currentPolicyData: PolicyData) => {
  let pData = { ...currentPolicyData };
  pData.l.cost += 1;
  return { policyData: pData };
};

export const updatePolicyData = (currentPolicyData: PolicyData) => {
  let pData = { ...currentPolicyData };
  return { policyData: pData };
};
