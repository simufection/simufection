import { getRandomInt } from "@/services/random";
import { Virus } from "./virus";
import { ParamsModel } from "../_params/params";
import { levyDist, randLevy } from "../_stats/levy";
import { Map } from "./maps";
import { Pref } from "./pref";

export enum InfectedState {
  notInfected = 0,
  infected = 1,
  dead = 2,
}

export type Ball = {
  forecolor: string;
  radius: number;
  prefId: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  stop: boolean;
  first: boolean;
  infectedState: InfectedState;
  masked: boolean;
  remainLevy: number;
  count: number;
  reinfect: boolean;
  turnInfection: number;
  turnHealed: number;
  turnReMove: number;
  turnsRequiredForHeal: number;
  turnsRequiredForDead: number;
  turnsRequiredForReinfect: number;
  turnRemoveMask: number;
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
    prefId: map[x][y],
    x: x,
    y: y,
    dx: 0,
    dy: 0,
    stop: flag_stop,
    infectedState: InfectedState.notInfected,
    first: false,
    masked: false,
    remainLevy: 0,
    count: 0,
    reinfect: false,
    turnInfection: 0,
    turnHealed: 0,
    turnsRequiredForHeal: 0,
    turnsRequiredForDead: 0,
    turnRemoveMask: 0,
    turnsRequiredForReinfect: 0,
    turnReMove: 0,
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
    params.TURNS_REQUIRED_FOR_DEAD * 5,
    params.TURNS_REQUIRED_FOR_REINFECT
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
  params: ParamsModel,
  prefs: { [name: number]: Pref }
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
    const onScreen = (x: number, y: number) => {
      return 0 <= x && x < params.MAX_WIDTH && 0 <= y && y < params.MAX_HEIGHT;
    };
    const flag_reflect: boolean = Math.random() < params.BORDER_RATE;
    const rand = Math.random();

    const lockdownJudge = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      remainLevy: number
    ): boolean => {
      const fromPrefLockedDown: boolean =
        onScreen(
          Math.floor(x + dx * remainLevy),
          Math.floor(y + dy * remainLevy)
        ) &&
        rand < prefs[prefId].lockdownCompliance &&
        prefs[prefId].isLockedDown &&
        mp[Math.floor(x + dx * remainLevy)][Math.floor(y + dy * remainLevy)] !=
          prefId;

      const toPrefLockedDown: boolean =
        mp[Math.floor(x + dx)][Math.floor(y + dy)] > 0 &&
        mp[Math.floor(x + dx)][Math.floor(y + dy)] != prefId &&
        rand <
          prefs[mp[Math.floor(x + dx)][Math.floor(y + dy)]]
            .lockdownCompliance &&
        prefs[mp[Math.floor(x + dx)][Math.floor(y + dy)]].isLockedDown;

      return fromPrefLockedDown || toPrefLockedDown;
    };

    let cnt = 0;
    while (
      remainLevy == 0 ||
      mp[Math.floor(x + dx)][Math.floor(y + dy)] == 0 ||
      (mp[Math.floor(x)][Math.floor(y)] != -1 &&
        mp[Math.floor(x + dx)][Math.floor(y + dy)] == -1 &&
        flag_reflect) ||
      lockdownJudge(x, y, dx, dy, remainLevy)
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
  virus: Virus,
  prefs: { [name: number]: Pref }
) => {
  const balls = [...currentBalls];

  const ballNum = balls.length;
  for (let i = 0; i < ballNum; i++) {
    if (balls[i].infectedState == InfectedState.dead) continue;
    if (balls[i].turnRemoveMask == turn && balls[i].masked) {
      balls[i].masked = false;
    }

    if (
      turn - balls[i].turnInfection - balls[i].turnsRequiredForHeal >= 0 &&
      balls[i].infectedState == InfectedState.infected
    ) {
      if (
        (turn - balls[i].turnInfection - balls[i].turnsRequiredForHeal) %
          virus.turnsJudgeHeal ==
        0
      ) {
        const rand = Math.random();
        if (rand < virus.healProb) {
          balls[i].infectedState = InfectedState.notInfected;
          balls[i].forecolor = params.COLOR_RECOVERED;
          balls[i].turnHealed = turn;
          balls[i].stop = false;
          balls[i].turnReMove = 0;
        }
      }
    }

    if (
      balls[i].turnHealed + balls[i].turnsRequiredForReinfect == turn &&
      !balls[i].reinfect
    ) {
      balls[i].reinfect = true;
    }

    if (
      turn - balls[i].turnInfection - balls[i].turnsRequiredForDead >= 0 &&
      balls[i].infectedState == InfectedState.infected
    ) {
      if (
        (turn - balls[i].turnInfection - balls[i].turnsRequiredForDead) %
          virus.turnsJudgeDead ==
        0
      ) {
        const rand = Math.random();
        if (rand < virus.deadProb) {
          balls[i].infectedState = InfectedState.dead;
          balls[i].stop = true;
          balls[i].forecolor = params.COLOR_DEAD;
        }
        continue;
      }
    }

    if (balls[i].turnReMove == turn) {
      if (balls[i].infectedState == InfectedState.notInfected) {
        balls[i].stop = false;
      }
    }
    const lockdownCoef: number = prefs[balls[i].prefId].isLockedDown
      ? params.INFECTION_PROB_RATE_LOCKDOWN
      : 1;
    for (let j = i + 1; j < ballNum; j++) {
      if (
        balls[i].prefId != balls[j].prefId &&
        (prefs[balls[i].prefId].isLockedDown ||
          prefs[balls[j].prefId].isLockedDown)
      ) {
        continue;
      }
      if (balls[j].infectedState == InfectedState.dead || balls[j].masked)
        continue;

      if (balls[i].infectedState == InfectedState.infected) {
        if (
          isOverlapTo(balls[i], [balls[j].x, balls[j].y]) &&
          (balls[i].first
            ? true
            : balls[j].count == 0
            ? Math.random() < virus.prob * lockdownCoef
            : balls[j].reinfect &&
              Math.random() <
                params.REINFECT_PROB *
                  virus.prob *
                  lockdownCoef *
                  (1 / balls[j].count))
        ) {
          setContacted(
            balls[j],
            turn,
            params,
            virus.turnsRequiredForHeal,
            virus.turnsRequiredForDead,
            virus.turnsRequiredForReinfect
          );
        }
      } else if (balls[j].infectedState == InfectedState.infected) {
        if (
          isOverlapTo(balls[j], [balls[i].x, balls[i].y]) &&
          (balls[j].first
            ? true
            : balls[i].count == 0
            ? Math.random() < virus.prob * lockdownCoef
            : balls[i].reinfect &&
              Math.random() <
                params.REINFECT_PROB *
                  virus.prob *
                  lockdownCoef *
                  (1 / balls[i].count))
        ) {
          setContacted(
            balls[i],
            turn,
            params,
            virus.turnsRequiredForHeal,
            virus.turnsRequiredForDead,
            virus.turnsRequiredForReinfect
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
  turnsRequiredForDead: number,
  turnsRequiredForReinfect: number
) => {
  ball.infectedState = InfectedState.infected;
  ball.reinfect = false;
  ball.first = true;
  ball.count++;
  ball.forecolor = params.COLOR_INFECTED;
  ball.turnInfection = turnInfection;
  ball.turnsRequiredForHeal = turnsRequiredForHeal;
  ball.turnsRequiredForDead = turnsRequiredForDead;
  ball.turnsRequiredForReinfect = turnsRequiredForReinfect;
};

const setContacted = (
  ball: Ball,
  turnInfection: number,
  params: ParamsModel,
  turnsRequiredForHeal: number,
  turnsRequiredForDead: number,
  turnsRequiredForReinfect: number
) => {
  ball.infectedState = InfectedState.infected;
  ball.reinfect = false;
  ball.first = false;
  ball.count++;
  ball.forecolor = params.COLOR_INFECTED;
  ball.turnInfection = turnInfection;
  ball.turnsRequiredForHeal = turnsRequiredForHeal;
  ball.turnsRequiredForDead = turnsRequiredForDead;
  ball.turnsRequiredForReinfect = turnsRequiredForReinfect;
};

export const updateBalls = (
  currentBalls: Ball[],
  params: ParamsModel,
  turns: number,
  virus: Virus,
  map: Map,
  prefs: { [name: number]: Pref }
) => {
  const ballsEvents: [number, string, any][] = [];
  const tmpBalls = updatePosition(currentBalls, map, params, prefs);
  const balls = updateBallState(tmpBalls, params, turns, virus, prefs);
  return { balls: balls, ballsEvents: ballsEvents };
};

export const infectionRate = (balls: Ball[], prefId: number) => {
  const totBalls = balls.filter((b) => b.prefId == prefId);
  const infectedBalls = totBalls.filter(
    (b) => b.infectedState == InfectedState.infected
  );
  return totBalls.length > 0 ? infectedBalls.length / totBalls.length : 0;
};
