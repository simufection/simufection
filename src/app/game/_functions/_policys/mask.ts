import { ParamsModel } from "../../_params/params";
import { InfectedState } from "../../_states/balls";
import { GameState } from "../../_states/state";

export const mask = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];
  const data = { all: 0, num: 0 };

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].infectedState == InfectedState.infected) {
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
