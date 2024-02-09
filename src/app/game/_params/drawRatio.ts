import { ParamsModel } from "./params";

export interface DrawRatioModel {
  INFECTED_INCREMENTAL: number;
  WIDTH: number;
  HEIGHT: number;
}

export const DrawRatio = (
  params: ParamsModel,
  infectedIncremental?: number
): DrawRatioModel => {
  return {
    INFECTED_INCREMENTAL: infectedIncremental || 3,
    WIDTH: 1,
    HEIGHT: params.CHART_HEIGHT / params.MAX_BALLS,
  };
};
