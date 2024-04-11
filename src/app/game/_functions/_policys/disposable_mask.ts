import { ParamsModel } from "../../_params/params";
import { InfectedState } from "../../_states/balls";
import { GameState } from "../../_states/state";

export const disposable_mask = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];
  const data = { num: 0 };
  let distribute_num = params.DISTRIBUTE_NUM;
  let disposable_block_time = params.DISPOSABLE_BLOCK_TIME;
  for (let block_num = 0; block_num < disposable_block_time; block_num++) {
    for (let i = 0; i < balls.length; i++) {
      if (distribute_num == 0) break;
      if (
        balls[i].infectedState == InfectedState.infected &&
        balls[i].disposable_mask_num == block_num
      ) {
        distribute_num -= 1;
        data.num++;
        balls[i].disposable_mask_num = disposable_block_time;
      }
    }
  }
  return { balls: balls, data: data };
};
