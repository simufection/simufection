import { DrawRatioModel, ParamsModel } from "../_types/Models";

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
