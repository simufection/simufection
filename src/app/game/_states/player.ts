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
  const a = 1;
  player.pt =
    params.MAX_DELTA_POINT -
    (a * (params.MAX_DELTA_POINT - params.INITIAL_DELTA_POINT)) /
      (a +
        (params.MAX_DELTA_POINT - params.INITIAL_DELTA_POINT) *
          (damage_count / params.MAX_BALLS));
  player.points += player.pt;

  return player;
};

export const updatePlayer = (
  currentState: SceneState,
  currentPlayer: Player,
  params: ParamsModel
) => {
  const playerEvents: [number, string, any][] = [];
  const player = updatePoint(currentState, currentPlayer, params);

  return { player: player, playerEvents: playerEvents };
};
