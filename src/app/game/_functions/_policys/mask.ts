import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const mask = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].contacted) {
      balls[i].masked = true;
      balls[i].turnRemoveMask = state.sceneState.turns + params.MASK_DURATION;
    }
  }
  return balls;
};
