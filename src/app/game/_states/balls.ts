import { getRandomInt } from "@/services/random";
import { Bar, contains } from "./bars";
import { Virus } from "./virus";
import { ParamsModel } from "../_params/params";
import { levyDist, randLevy } from "../_stats/levy";
import { Map } from "./maps";

export type Ball = {
  forecolor: string;
  radius: number;
  prefId?: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  stop: boolean;
  contacted: boolean;
  first: boolean;
  healed: boolean;
  dead: boolean;
  turnHeal: number;
  remainLevy: number;
  count: number;
  turnDead: number;
};

const createBall = (
  flag_stop: boolean,
  params: ParamsModel,
  map: number[][],
  prefId?: number
): Ball => {
  const maxX = map.length;
  const maxY = map[0].length;
  let x = getRandomInt(params.RADIUS, maxX - params.RADIUS);
  let y = getRandomInt(params.RADIUS, maxY - params.RADIUS);
  if (prefId) {
    while (map[x][y] != prefId) {
      x = getRandomInt(params.RADIUS, maxX - params.RADIUS);
      y = getRandomInt(params.RADIUS, maxY - params.RADIUS);
    }
  } else {
    while (map[x][y] == 0) {
      x = getRandomInt(params.RADIUS, maxX - params.RADIUS);
      y = getRandomInt(params.RADIUS, maxY - params.RADIUS);
    }
  }
  return {
    forecolor: params.COLOR_UNINFECTED,
    radius: params.RADIUS,
    prefId: prefId,
    x: x,
    y: y,
    dx: 0,
    dy: 0,
    stop: flag_stop,
    contacted: false,
    first: false,
    healed: false,
    dead: false,
    turnHeal: 0,
    turnDead: 0,
    remainLevy: 0,
    count: 0,
  };
};

export const createBalls = (params: ParamsModel, map: Map): Ball[] => {
  const balls: Ball[] = [];
  const mp = map.map;

  const targetMax = Math.floor(
    params.MAX_BALLS * (1.0 - params.RATIO_OF_BALLS_STOPPED)
  );

  const randNum = getRandomInt(0, targetMax);

  for (let i = 0; i < targetMax; i++) {
    const randPref = map.func();
    balls.push(createBall(false, params, mp, randPref));
  }

  setFirstContacted(
    balls[randNum],
    0,
    params,
    params.TURNS_REQUIRED_FOR_HEAL * 5,
    params.TURNS_REQUIRED_FOR_DEAD * 5
  );

  for (let i = 0; i < params.MAX_BALLS - targetMax; i++) {
    const randPref = map.func();
    balls.push(createBall(true, params, mp, randPref));
  }

  return balls;
};

const updatePosition = (
  currentBalls: Ball[],
  map: Map,
  params: ParamsModel
) => {
  const balls = [...currentBalls];
  const newBalls = [] as Ball[];
  const mp = map.map;

  balls.forEach((ball) => {
    const newBall = { ...ball };
    let { x, y, prefId, dx, dy, remainLevy, stop } = newBall;
    if (stop) {
      newBalls.push(ball);
      return;
    }

    let [randDeg, randDis] = [0, 0];

    if (mp[Math.floor(x)][Math.floor(y)] == 0) {
      [dx, dy, stop] = [0, 0, true];
    }

    const flag_reflect: boolean = Math.random() < params.BORDER_RATE;
    let cnt = 0;
    while (
      remainLevy == 0 ||
      mp[Math.floor(x + dx)][Math.floor(y + dy)] == 0 ||
      (params.OPTION_REFLECTION == 0 &&
        mp[Math.floor(x + dx)][Math.floor(y + dy)] != prefId &&
        mp[Math.floor(x + dx)][Math.floor(y + dy)] != -1 &&
        flag_reflect) ||
      (params.OPTION_REFLECTION == 1 &&
        mp[Math.floor(x)][Math.floor(y)] != -1 &&
        mp[Math.floor(x + dx)][Math.floor(y + dy)] == -1 &&
        flag_reflect)
    ) {
      if (cnt++ > 100) {
        [dx, dy, stop] = [0, 0, true];
        break;
      }
      randDeg = Math.random() * Math.PI * 2;
      randDis = randLevy(1, params.LEVY_SCALE, params.LEVY_MAX);
      dx = Math.cos(randDeg);
      dy = Math.sin(randDeg);
      remainLevy = Math.floor(randDis);
    }
    x += dx;
    y += dy;
    remainLevy--;

    if (mp[Math.floor(x)][Math.floor(y)] != -1) {
      prefId = mp[Math.floor(x)][Math.floor(y)];
    }

    newBalls.push({
      ...ball,
      ...{
        x: x,
        y: y,
        prefId: prefId,
        dx: dx,
        dy: dy,
        remainLevy: remainLevy,
        stop: stop,
      },
    });
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
    if (balls[i].dead) continue;

    if (balls[i].turnHeal == turn) {
      balls[i].healed = true;
      balls[i].forecolor = params.COLOR_RECOVERED;
    }

    if (balls[i].turnDead == turn) {
      const rand = Math.random();
      if (rand < params.DEAD_PROB) {
        balls[i].dead = true;
        balls[i].stop = true;
        balls[i].forecolor = params.COLOR_DEAD;
      }
      continue;
    }

    const conditions_i = balls[i].contacted && !balls[i].healed;

    for (let j = i + 1; j < ballNum; j++) {
      if (balls[j].dead) continue;
      const conditions_j = balls[j].contacted && !balls[j].healed;
      /*
      if (conditions_i && conditions_j) {
        continue;
      }
      if (balls[i].healed || balls[j].healed) {
        continue;
      }
      */

      if (conditions_i) {
        if (
          isOverlapTo(balls[i], [balls[j].x, balls[j].y]) &&
          (balls[i].first
            ? true
            : balls[j].count == 0
            ? Math.random() < virus.prob
            : Math.random() <
              params.REINFECT_PROB * virus.prob * (1 / balls[j].count))
        ) {
          setContacted(
            balls[j],
            turn,
            params,
            virus.turnsRequiredForHeal,
            virus.turnsRequiredForDead
          );
        }
      } else if (conditions_j) {
        if (
          isOverlapTo(balls[j], [balls[i].x, balls[i].y]) &&
          (balls[j].first
            ? true
            : balls[i].count == 0
            ? Math.random() < virus.prob
            : Math.random() <
              params.REINFECT_PROB * virus.prob * (1 / balls[i].count))
        ) {
          setContacted(
            balls[i],
            turn,
            params,
            virus.turnsRequiredForHeal,
            virus.turnsRequiredForDead
          );
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

const setFirstContacted = (
  ball: Ball,
  turnInfection: number,
  params: ParamsModel,
  turnsRequiredForHeal: number,
  turnsRequiredForDead: number
) => {
  ball.contacted = true;
  ball.healed = false;
  ball.first = true;
  ball.count++;
  ball.forecolor = params.COLOR_INFECTED;
  ball.turnHeal = turnInfection + turnsRequiredForHeal;
  ball.turnDead = turnInfection + turnsRequiredForDead;
};

const setContacted = (
  ball: Ball,
  turnInfection: number,
  params: ParamsModel,
  turnsRequiredForHeal: number,
  turnsRequiredForDead: number
) => {
  ball.contacted = true;
  ball.healed = false;
  ball.count++;
  ball.first = false;
  ball.forecolor = params.COLOR_INFECTED;
  ball.turnHeal = turnInfection + turnsRequiredForHeal;
  ball.turnDead = turnInfection + turnsRequiredForDead;
};

export const updateBalls = (
  currentBalls: Ball[],
  bars: Bar[],
  params: ParamsModel,
  turns: number,
  virus: Virus,
  map: Map
): Ball[] => {
  const tmpBalls = updatePosition(currentBalls, map, params);
  const balls = updateBallState(tmpBalls, params, turns, virus);
  return balls;
};
