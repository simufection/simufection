import { COLORS } from "../../_params/colors";
import { ParamsModel } from "../../_params/params";
import { POLICY_PARAMS } from "../../_params/policyParams";
import {
  Bar,
  closeToBars,
  createBar,
  drawBar,
  updatePosition,
  updateRotation,
} from "../../_states/bars";
import { Player, updatePoint } from "../../_states/player";
import { GameState } from "../../_states/state";

export const createBarFunc = (
  state: GameState,
  params: ParamsModel
): { bars: Bar[]; res: boolean; player?: Player } => {
  const { keys, player, bars } = state;
  const { down, up, downAll } = keys;
  const barNum = bars.length;
  let newBar = bars[barNum - 1];

  if (down.has("b")) {
    newBar = updateRotation(newBar, params);
  }

  if (down.has("Escape")) {
    bars.pop();
    return { bars: bars, res: true };
  }

  if (down.has("Enter")) {
    if (!closeToBars(bars, params)) {
      newBar.color = COLORS.BLACK;
      bars.pop();
      bars.push(newBar);
      const newPlayer = updatePoint(
        player,
        -POLICY_PARAMS.POINTS_FOR_BAR,
        params
      );
      return { bars: bars, res: true, player: newPlayer };
    }
  }

  //move
  if (downAll.has("ArrowRight")) {
    newBar = updatePosition(newBar, 1, 0, params);
  }
  if (downAll.has("ArrowLeft")) {
    newBar = updatePosition(newBar, -1, 0, params);
  }
  if (downAll.has("ArrowUp")) {
    newBar = updatePosition(newBar, 0, -1, params);
  }
  if (downAll.has("ArrowDown")) {
    newBar = updatePosition(newBar, 0, 1, params);
  }
  bars.pop();
  bars.push(newBar);

  return { bars: bars, res: false };
};

export const createBarInit = (bars: Bar[], params: ParamsModel) => {
  const newBar = createBar(
    true,
    Math.floor(params.MAX_WIDTH / 2) - Math.floor(params.BAR_WIDTH / 2),
    Math.floor(params.MAX_HEIGHT / 2) - Math.floor(params.BAR_LENGTH / 2),
    params.BAR_WIDTH,
    params.BAR_LENGTH,
    COLORS.GRAY
  );
  bars.push(newBar);
};
