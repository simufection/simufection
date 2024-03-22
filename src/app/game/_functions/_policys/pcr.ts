import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const pcr = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].dead) continue;
    const condition_i = balls[i].contacted && !balls[i].healed;

    if (Math.random() < params.CHECK_INFECTED) {
      if (!condition_i && balls[i].stop) {
        balls[i].stop = false;
        continue;
      }
      if ((condition_i || balls[i].reinfect) && !balls[i].healed) {
        if (Math.random() < params.POSITIVE_RATE) {
          balls[i].stop = true;
        }
      } else if (Math.random() < params.FALSE_POSITIVE_RATE) {
        balls[i].stop = true;
        balls[i].turnReMove =
          state.sceneState.turns + params.TURNS_REQUIRED_FOR_RE_MOVE;
      }
    }
  }
  return balls;
};
