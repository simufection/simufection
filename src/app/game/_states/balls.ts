import { getRandomInt } from "@/services/random";
import { BallModel, ParamsModel } from "../_types/Models";
import { Bar, contains } from "./bars";
import { Virus } from "./virus";

export type Ball = BallModel;

const createBall = (flag_stop: boolean, params: ParamsModel): Ball => {
  return {
    forecolor: params.COLOR_UNINFECTED,
    radius: params.RADIUS,
    x: getRandomInt(params.RADIUS, params.MAX_WIDTH - params.RADIUS),
    y: getRandomInt(params.RADIUS, params.MAX_HEIGHT - params.RADIUS),
    addX: flag_stop
      ? 0
      : getRandomInt(
          params.MOVEMENT[0],
          params.MOVEMENT[1] + 1,
          params.MOVEMENT[2]
        ),
    addY: flag_stop
      ? 0
      : getRandomInt(
          params.MOVEMENT[0],
          params.MOVEMENT[1] + 1,
          params.MOVEMENT[2]
        ),
    contacted: false,
    healed: false,
    turnHeal: 0,
  };
};

export const createBalls = (params: ParamsModel): Ball[] => {
  const balls: Ball[] = [];

  const targetMax = Math.floor(
    params.MAX_BALLS * (1.0 - params.RATIO_OF_BALLS_STOPPED)
  );

  const randNum = getRandomInt(0, targetMax);

  for (let i = 0; i < targetMax; i++) {
    balls.push(createBall(false, params));
  }

  setContacted(balls[randNum], 0, params, params.TURNS_REQUIRED_FOR_HEAL);

  for (let i = 0; i < params.MAX_BALLS - targetMax; i++) {
    balls.push(createBall(true, params));
  }

  return balls;
};

const updatePosition = (currentBalls: Ball[], bars: Bar[]) => {
  const balls = [...currentBalls];
  const newBalls = [] as Ball[];

  balls.forEach((ball) => {
    let { x, y, addX, addY } = ball;
    const nextX = x + addX;
    const nextY = y + addY;
    let flagVer = false;
    let flagHor = false;

    bars.forEach((bar) => {
      if (contains(bar, nextX, nextY)) {
        if (bar.isVertical) {
          flagVer = true;
          addX *= -1;
          if (x < bar.x) {
            x = 2 * bar.x - nextX;
          } else {
            x = 2 * (bar.x + bar.dx) - nextX;
          }
        } else {
          flagHor = true;
          addY *= -1;

          if (y < bar.y) {
            y = 2 * bar.y - nextY;
          } else {
            y = 2 * (bar.y + bar.dy) - nextY;
          }
        }
      }
    });

    if (!flagVer) {
      x = nextX;
    }
    if (!flagHor) {
      y = nextY;
    }
    newBalls.push({ ...ball, ...{ x: x, y: y, addX: addX, addY: addY } });
  });
  return newBalls;
};

const updateBallState = (
  currentBalls: Ball[],
  params: ParamsModel,
  turn: number,
  virus: Virus
) => {
  const balls = [...currentBalls];

  const ballNum = balls.length;
  for (let i = 0; i < ballNum; i++) {
    if (balls[i].turnHeal == turn) {
      balls[i].healed = true;
      balls[i].forecolor = params.COLOR_RECOVERED;
    }

    const conditions_i = balls[i].contacted && !balls[i].healed;

    for (let j = i + 1; j < ballNum; j++) {
      const conditions_j = balls[j].contacted && !balls[j].healed;

      if (conditions_i && conditions_j) {
        continue;
      }
      if (balls[i].healed || balls[j].healed) {
        continue;
      }

      if (conditions_i) {
        if (
          isOverlapTo(balls[i], [balls[j].x, balls[j].y]) &&
          Math.random() < virus.prob
        ) {
          setContacted(balls[j], turn, params, virus.turnsRequiredForHeal);
        }
      } else if (conditions_j) {
        if (
          isOverlapTo(balls[j], [balls[i].x, balls[i].y]) &&
          Math.random() < virus.prob
        ) {
          setContacted(balls[i], turn, params, virus.turnsRequiredForHeal);
        }
      }
    }
  }
  return balls;
};

const isOverlapTo = (ball: Ball, targetPos: FixedLengthArray<number, 2>) => {
  return (
    (targetPos[0] - ball.x) ** 2 + (targetPos[1] - ball.y) ** 2 <
    4 * ball.radius ** 2
  );
};

const setContacted = (
  ball: Ball,
  turnInfection: number,
  params: ParamsModel,
  turnsRequiredForHeal: number
) => {
  ball.contacted = true;
  ball.forecolor = params.COLOR_INFECTED;
  ball.turnHeal = turnInfection + turnsRequiredForHeal;
};

export const updateBalls = (
  currentBalls: Ball[],
  bars: Bar[],
  params: ParamsModel,
  turns: number,
  virus: Virus
): Ball[] => {
  const tmpBalls = updatePosition(currentBalls, bars);
  const balls = updateBallState(tmpBalls, params, turns, virus);
  return balls;
};
