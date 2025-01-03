"use strict";
import { InputBox } from "@/components/inputBox";
import { useContext, useState } from "react";
import { GameStateContext } from "@/app/contextProvoder";
import { SendScoreState } from "@/hooks/game/useGameControl";
import { Button } from "@/components/button";
import { sendScore } from "@/app/_functions/_game/score";
import { Axios } from "@/services/axios";
import { appVersion } from "@/consts/appVersion";

const SendScoreInput = () => {
  const [urName, setUrName] = useState("");
  const [feedback, setFeedback] = useState("");
  const {
    score,
    sendScoreState,
    setSendScoreState,
    rankingData,
    setRankingData,
    gameState,
    mapName,
  } = useContext(GameStateContext)!;
  const version = appVersion;
  const ver = `${version.split(".")[0]}.${version.split(".")[1]}`;

  return (
    <>
      <InputBox
        className="p-score-input__result-input u-my36"
        placeholder="プレーヤー名を入力"
        disabled={sendScoreState != SendScoreState.before}
        value={urName}
        onChange={(e) => setUrName(e.target.value)}
      />
      <textarea
        className="p-score-input__feedback-input u-mb36"
        placeholder="感想を入力"
        disabled={sendScoreState != SendScoreState.before}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button
        className="p-score-input__result-submit u-mb36"
        label={`${
          sendScoreState != SendScoreState.done ? "スコア送信" : "送信済"
        }`}
        disabled={sendScoreState != SendScoreState.before}
        onClick={async () => {
          if (urName == "" && !alert("ユーザーネームを入力してください")!)
            return;
          setSendScoreState(SendScoreState.sending);
          const res = await sendScore(
            score || 0,
            urName,
            feedback,
            mapName,
            gameState?.sceneState.turns || null,
            gameState?.events || null
          );
          if (res) {
            alert("送信しました");
            setSendScoreState(SendScoreState.done);
            Axios.post("/api/getRanking", {}).then((res) => {
              setRankingData({
                ...rankingData,
                ...{ [ver]: { all: res.data.all, today: res.data.today } },
              });
            });
          } else {
            alert("失敗しました");
            setSendScoreState(SendScoreState.before);
          }
        }}
      />
    </>
  );
};

export default SendScoreInput;
