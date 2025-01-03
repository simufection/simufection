import { ParamsModel } from "@/app/_params/params";
import { GameState, PlayingState } from "@/app/_states/state";
import { Axios } from "@/services/axios";
import { getRandomString } from "@/services/randomString";
import { sendSlackMessage } from "@/services/sendSlackMessages";

export interface SendScoreData {
  urName: string;
  score: number;
  map: string | null;
  feedback: string | null;
  turns: number | null;
  events: [number, string, any][] | null;
}

export const calcScore = (
  state: GameState,
  params: ParamsModel,
  userId: string
) => {
  const contacted = state.sceneState.contactedCount;
  const all = params.MAX_BALLS;
  const turns = state.sceneState.turns;

  const survivor = all - contacted;

  const sum_infected = state.sceneState.sum_infected;
  const sum_dead = state.sceneState.sum_dead;

  const isClear = survivor == 0 ? false : true;

  const score = Math.floor(
    isClear
      ? 100000 *
          Math.exp(
            -(
              (params.COEFFICIENT_OF_sum_infected * sum_infected +
                params.COEFFICIENT_OF_sum_dead * sum_dead) /
              1e6
            )
          )
      : 0
  );
  console.log(sum_infected, sum_dead);

  Axios.post("/api/addLog", { action: "clear", id: userId });
  return score;
};

export const sendScore = async (
  score: number,
  urName: string,
  feedback: string,
  map: string | null,
  turns: number | null,
  events: [number, string, any][] | null
): Promise<boolean> => {
  const data: SendScoreData = {
    urName: urName,
    score: score,
    feedback: feedback,
    map: map,
    turns: turns,
    events: events,
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
