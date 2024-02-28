import { ParamsModel } from "../../_params/params";
import { GameState } from "../../_states/state";

export const pcr = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];
  console.log("pcr policy is called.");

  for (let i = 0; i < balls.length; i++) {
    if (Math.random() < params.CHECK_INFECTED/100) {
      // 検査実施
      console.log("checking_")
      // if ((balls[i].contacted || !balls[i].reinfect) && !balls[i].healed && !balls[i].dead && !balls[i].stop)
      if (true)
       {
        // if (Math.random() < params.POSITIVE_RATE/100)
        if (true)
         {
          // 陽性
          console.log("positive")
          balls[i].stop=true;
      }
      else if (!balls[i].contacted && !balls[i].dead&& !balls[i].stop){
        if (Math.random() < params.FALSE_POSITIVE_RATE/100) {
          // 偽陽性
          balls[i].stop=true;
        }
      }
    }
  }
  return balls;
}
};
