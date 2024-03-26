import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const mask = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];
  const data = { all: 0, num: 0 };
  let nm = 0;

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].contacted) {
      data.all++;
      if (Math.random() < params.MASK_PROB) {
        data.num++;
        balls[i].masked = true;
        balls[i].turnRemoveMask = state.sceneState.turns + params.MASK_DURATION;
      }
    }
  }
  return { balls: balls, data: data };
};
