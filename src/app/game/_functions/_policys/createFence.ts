import { COLORS } from "../../_params/colors";
import { ParamsModel } from "../../_params/params";
import { Bar, closeToBars, updatePosition } from "../../_states/bars";
import { Fence, createFence } from "../../_states/fences";
import { Player, updatePoint } from "../../_states/player";
import { GameState } from "../../_states/state";

export const createFenceFunc = (
  state: GameState,
  params: ParamsModel
): { bars: Bar[]; res: boolean; player?: Player; fences: Fence[] } => {
  const { keys, player, bars, fences } = state;
  const { down, up, downAll } = keys;
  const fenceNum = fences.length;
  let newFence = fences[fenceNum - 1];
  let newBars = bars.slice(-4);

  const popAll = () => {
    fences.pop();
    bars.pop();
    bars.pop();
    bars.pop();
    bars.pop();
  };

  if (down.has("Escape")) {
    popAll();
    return { bars: bars, res: true, fences: fences };
  }

  if (down.has("Enter")) {
    if (!closeToBars(bars, params)) {
      const barNum = bars.length;
      newFence.color = COLORS.BLACK;
      newFence.barIndex = [barNum - 3, barNum - 2, barNum - 1, barNum];
      popAll();
      fences.push(newFence);
      newBars.forEach((bar) => {
        bar.color = COLORS.BLACK;
        bars.push(bar);
      });
      const newPlayer = updatePoint(player, -params.POINTS_FOR_BAR, params);
      return { bars: bars, res: true, player: newPlayer, fences: fences };
    }
  }
  //move
  if (downAll.has("ArrowRight")) {
    newBars.forEach((bar, index) => {
      newBars[index] = updatePosition(bar, 1, 0, params);
    });
  }
  if (downAll.has("ArrowLeft")) {
    newBars.forEach((bar, index) => {
      newBars[index] = updatePosition(bar, -1, 0, params);
    });
  }
  if (downAll.has("ArrowUp")) {
    newBars.forEach((bar, index) => {
      newBars[index] = updatePosition(bar, 0, -1, params);
    });
  }
  if (downAll.has("ArrowDown")) {
    newBars.forEach((bar, index) => {
      newBars[index] = updatePosition(bar, 0, 1, params);
    });
  }

  popAll();
  fences.push(newFence);

  newBars.forEach((bar) => {
    bars.push(bar);
  });

  return { bars: bars, res: false, fences: fences };
};

export const createFenceInit = (
  fences: Fence[],
  bars: Bar[],
  params: ParamsModel
) => {
  const { fence: newFence, bars: newBars } = createFence(
    Math.floor(params.MAX_WIDTH / 2) - Math.floor(params.BAR_WIDTH / 2),
    Math.floor(params.MAX_HEIGHT / 2) - Math.floor(params.BAR_LENGTH / 2),
    params.FENCE_WIDTH,
    params.FENCE_HEIGHT,
    params,
    COLORS.GRAY
  );
  fences.push(newFence);
  newBars.forEach((bar) => {
    bars.push(bar);
  });
};
