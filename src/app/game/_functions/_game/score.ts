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

export const sendScore = async (score: number, urName: string) => {
  const { updateGameStateFromGameView } = useContext(GameStateContext);
  const body = JSON.stringify({
    urName: urName,
    score: score,
  });
  await Axios.post("/api/sendScore", body).then(async (response) => {
    updateGameStateFromGameView({ playingState: PlayingState.waiting });
    const res = await response.data;
    if (res.success) {
      alert("登録完了しました");
    } else {
      alert(res.error);
    }
  });
};
