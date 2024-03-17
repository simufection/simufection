import { useContext } from "react";
import { ParamsModel } from "../../_params/params";
import { GameState, PlayingState } from "../../_states/state";
import { GameStateContext } from "../../contextProvoder";
import { Axios } from "@/services/axios";

export const calcScore = (state: GameState, params: ParamsModel) => {
  const contacted = state.sceneState.contactedCount;
  const all = params.MAX_BALLS;
  const turns = state.sceneState.turns;

  const survivor = all - contacted;

  const sum_infected = state.sceneState.sum_infected;
  const sum_dead = state.sceneState.sum_dead;
  const sum_healed = state.sceneState.sum_healed;

  const isClear = survivor == 0 ? false : true;

  const score = Math.floor(
    isClear ? 100000 * Math.exp(-((sum_infected + sum_dead) / 1e6)) : 0
  );
  return score;
};

export const sendScore = async (
  score: number,
  urName: string,
  feedback: string,
  map: string | null,
  turns: number | null
): Promise<boolean> => {
  const body = JSON.stringify({
    urName: urName,
    score: score,
    feedback: feedback,
    map: map,
    turns: turns,
  });

  try {
    const res = await Axios.post("/api/sendScore", body);
    return res.data.success;
  } catch (error) {
    return false;
  }
};
