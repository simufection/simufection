import { ParamsModel } from "@/app/_params/params";
import { InfectedState } from "@/app/_states/balls";
import { GameState } from "@/app/_states/state";

export const pcr = (state: GameState, params: ParamsModel) => {
  const balls = [...state.balls];
  const data = { all: 0, positive: 0 };
  let counter_false_negative = 0;

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].infectedState == InfectedState.dead) continue;

    if (Math.random() < params.CHECK_INFECTED) {
      data.all++;
      if (
        balls[i].infectedState == InfectedState.notInfected &&
        balls[i].stop
      ) {
        balls[i].stop = false;
        continue;
      }
      if (balls[i].infectedState == InfectedState.infected) {
        if (Math.random() < params.POSITIVE_RATE) {
          balls[i].stop = true;
          balls[i].forecolor = params.COLOR_PCRED;
          data.positive++;
        } else {
          counter_false_negative++;
        }
      } else if (Math.random() < params.FALSE_POSITIVE_RATE) {
        balls[i].stop = true;
        balls[i].turnReMove =
          state.sceneState.turns + params.TURNS_REQUIRED_FOR_RE_MOVE;
        data.positive++;
      }
    }
  }
  if (counter_false_negative == 0) {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].infectedState == InfectedState.infected) {
        balls[i].stop = false;
      }
    }
  }

  return { balls: balls, data: data };
};
