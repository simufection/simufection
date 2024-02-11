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

  const isClear = survivor == 0 ? false : true;

  const score = Math.floor(
    isClear ? (survivor * 1000) / turns + 100 : turns / 10
  );
  return score;
};

export const sendScore = async (
  score: number,
  urName: string
): Promise<boolean> => {
  const body = JSON.stringify({
    urName: urName,
    score: score,
  });

  try {
    const res = await Axios.post("/api/sendScore", body);
    return res.data.success;
  } catch (error) {
    return false;
  }
};
