import { initialize } from "next/dist/server/lib/render-server";
import { ParamsModel } from "../_params/params";
import { allPrefs } from "../_data/prefs";
import { Ball, infectionRate } from "./balls";
import { policies } from "../_functions/_policys/policies";

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
