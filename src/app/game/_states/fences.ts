import { COLORS } from "../_params/colors";
import { ParamsModel } from "../_params/params";
import { Bar } from "./bars";

export type Fence = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color?: string;
  width: number;
  barIndex: number[];
};

export const createFence = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  params: ParamsModel,
  color: string = COLORS.BLACK
): { bars: Bar[]; fence: Fence } => {
  const width = params.BAR_WIDTH;
  return {
    bars: [
      {
        isVertical: false,
        x: x,
        y: y,
        dx: dx,
        dy: width,
        color: color,
      },
      {
        isVertical: true,
        x: x,
        y: y + width,
        dx: width,
        dy: dy,
        color: color,
      },
      {
        isVertical: false,
        x: x + width,
        y: y + dy,
        dx: dx,
        dy: width,
        color: color,
      },
      {
        isVertical: true,
        x: x + dx,
        y: y,
        dx: width,
        dy: dy,
        color: color,
      },
    ],
    fence: {
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      width: width,
      color: color,
      barIndex: [],
    },
  };
};

export const updateFences = (currentFences: Fence[]): Fence[] => {
  const fences = currentFences;

  return fences;
};
