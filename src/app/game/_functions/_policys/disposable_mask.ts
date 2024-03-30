import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const disposable_mask = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];
  let distribute_num = params.DISTRIBUTE_NUM;

  for (let i = 0; i < balls.length; i++) {
    if (distribute_num == 0) break;
    if (balls[i].contacted) {
      balls[i].disposable_masked = false;
      distribute_num -= 1;
      balls[i].disposable_masked = true;
    }
  }
  return balls;
};
