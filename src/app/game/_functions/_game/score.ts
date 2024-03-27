import { ParamsModel } from "../../_params/params";
import { GameState, PlayingState } from "../../_states/state";
import { Axios } from "@/services/axios";
import { sendSlackMessage } from "@/services/sendSlackMessages";

export interface SendScoreData {
  urName: string;
  score: number;
  map: string | null;
  feedback: string | null;
  turns: number | null;
}

export const calcScore = (state: GameState, params: ParamsModel) => {
  const contacted = state.sceneState.contactedCount;
  const all = params.MAX_BALLS;
  const turns = state.sceneState.turns;

  const survivor = all - contacted;

  const sum_infected = state.sceneState.sum_infected;
  const sum_dead = state.sceneState.sum_dead;

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
  const data: SendScoreData = {
    urName: urName,
    score: score,
    feedback: feedback,
    map: map,
    turns: turns,
  };
  const body = JSON.stringify(data);

  try {
    const res = await Axios.post("/api/sendScore", body);
    if (res.data.success) {
      if (feedback != "") {
        sendSlackMessage(data);
      }
    }
    return res.data.success;
  } catch (error) {
    return false;
  }
};
