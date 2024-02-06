import { ParamsModel, PlayerModel } from "../_types/Models";

export type Player = PlayerModel;

export const updatePoint = (
  currentPlayer: Player,
  pt: number,
  params: ParamsModel,
  turns: number = 0
) => {
  const player = { ...currentPlayer };
  if (turns) {
    if (turns % params.TURNS_REQUIRED_FOR_POINT == 0) {
      player.points += pt;
    }
  } else {
    player.points += pt;
  }

  return player;
};

export const updatePlayer = (
  currentPlayer: Player,
  pt: number,
  turn: number,
  params: ParamsModel
): Player => {
  const player = updatePoint(currentPlayer, pt, params, turn);

  return player;
};
