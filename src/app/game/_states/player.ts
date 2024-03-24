import { ParamsModel } from "../_params/params";
import { SceneState } from "./sceneState";

export type Player = {
  points: number;
  points_turn: number;
};

export const updatePoint = (
  currentState: SceneState,
  currentPlayer: Player,
  pt: number,
  params: ParamsModel,
  turns: number = 0
) => {
  const player = { ...currentPlayer };
  const damage_count = currentState.infectedCount + currentState.deadCount;
  const TURNS_REQUIRED_FOR_POINT = Math.floor(
    250 * (1 - damage_count / params.MAX_BALLS)
  );
  if (turns) {
    /*非連続的な推移をさせる場合
    damage_count < Math.floor(0.1 * params.MAX_BALLS)
      ? (TURNS_REQUIRED_FOR_POINT *= 5)
      : damage_count < Math.floor(0.2 * params.MAX_BALLS)
      ? (TURNS_REQUIRED_FOR_POINT *= 4)
      : damage_count < Math.floor(0.3 * params.MAX_BALLS)
      ? (TURNS_REQUIRED_FOR_POINT *= 3)
      : damage_count < Math.floor(0.4 * params.MAX_BALLS)
      ? (TURNS_REQUIRED_FOR_POINT *= 2)
      : (TURNS_REQUIRED_FOR_POINT *= 1);
      */
    if (
      turns >= player.points_turn + TURNS_REQUIRED_FOR_POINT &&
      player.points < params.MAX_POINTS
    ) {
      player.points += pt;
      player.points_turn = turns;
    }
  } else {
    player.points += pt;
    player.points_turn = turns;
  }

  return player;
};

export const updatePlayer = (
  currentState: SceneState,
  currentPlayer: Player,
  pt: number,
  turn: number,
  params: ParamsModel
): Player => {
  const player = updatePoint(currentState, currentPlayer, pt, params, turn);

  return player;
};
