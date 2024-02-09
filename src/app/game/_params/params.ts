import { useState } from "react";
import { COLORS } from "./colors";

export interface ParamsModel {
  [name: string]: any;
  setParams: (_: {}) => void;
}

export const Params = (): ParamsModel => {
  const [params, setParams] = useState<ParamsModel>({
    MAX_WIDTH: 640,
    MAX_HEIGHT: 480,
    MAX_BALLS: 1000,
    RADIUS: 3,
    MOVEMENT: [-3, 3, 1],
    RATIO_OF_BALLS_STOPPED: 0.0,
    COLOR_INFECTED: COLORS.RED,
    COLOR_UNINFECTED: COLORS.BLUE,
    COLOR_RECOVERED: COLORS.GREEN,
    SLEEP_SEC: 1 / 30,
    CHART_HEIGHT: 50,
    BAR_WIDTH: 6,
    BAR_LENGTH: 200,
    TURNS_REQUIRED_FOR_HEAL: 200,
    MAX_BALLS_NUM: 1000,
    DEFAULT_BARS: 4,
    TURNS_REQUIRED_FOR_POINT: 50,
    FENCE_WIDTH: 150,
    FENCE_HEIGHT: 150,
    LEVY_SCALE: 4,
    LEVY_MAX: 50,
    MAX_POINTS: 10,
    setParams: (newParams) => {
      setParams((prevParams) => ({
        ...prevParams,
        ...newParams,
      }));
    },
  });

  return params;
};
