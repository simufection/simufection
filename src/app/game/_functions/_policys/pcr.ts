import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const pcr = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];

  for (let i = 0; i < balls.length; i++) {
    // 前回の検査で偽陽性だった場合は解除
    if (balls[i].stop && !balls[i].contacted) {
      balls[i].stop = false;
    }
    if (!balls[i].stop&&Math.random() < params.CHECK_INFECTED/100) {
      // 検査実施
      if ((balls[i].contacted || balls[i].reinfect) && !balls[i].healed)
       {
        if (Math.random() < params.POSITIVE_RATE/100)
         {
          // 陽性
          balls[i].stop=true;
      }}
      else if (Math.random() < params.FALSE_POSITIVE_RATE/100) {
          // 偽陽性
          balls[i].stop=true;
          balls[i].turnReMove = state.sceneState.turns + params.TURNS_REQUIRED_FOR_RE_MOVE;
        }

  }
}
return balls;
};
