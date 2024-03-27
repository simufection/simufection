import { ParamsModel } from "../_params/params";
import { SceneState } from "./sceneState";

export type Player = {
  points: number;
  pt: number;
};

export const updatePoint = (
  currentState: SceneState,
  currentPlayer: Player,
  params: ParamsModel
) => {
  const player = { ...currentPlayer };
  const damage_count = currentState.infectedCount + currentState.deadCount;

  player.pt =
    params.INITIAL_DELTA_POINT / (1 - damage_count / params.MAX_BALLS + 1e-8);
  player.points += player.pt;

  return player;
};

export const updatePlayer = (
  currentState: SceneState,
  currentPlayer: Player,
  params: ParamsModel
) => {
  const playerEvents: string[] = [];
  const player = updatePoint(currentState, currentPlayer, params);

  return { player: player, playerEvents: playerEvents };
};
