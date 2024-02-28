"use strict";
import { InputBox } from "@/components/inputBox";
import { useContext, useState } from "react";
import { GameStateContext } from "../contextProvoder";
import { SendScoreState } from "@/hooks/game/useGameControl";
import { Button } from "@/components/button";
import { sendScore } from "../_functions/_game/score";

const SendScoreInput = () => {
  const [urName, setUrName] = useState("");
  const { score, sendScoreState, setSendScoreState } =
    useContext(GameStateContext)!;

  return (
    <>
      <InputBox
        className="p-game__result-input"
        placeholder="プレーヤー名を入力"
        disabled={sendScoreState != SendScoreState.before}
        value={urName}
        onChange={(e) => setUrName(e.target.value)}
      />
      <Button
        className="p-game__result-submit"
        label={`${
          sendScoreState != SendScoreState.done ? "スコア送信" : "送信済"
        }`}
        disabled={sendScoreState != SendScoreState.before}
        onClick={async () => {
          if (urName == "" && !alert("ユーザーネームを入力してください")!)
            return;
          setSendScoreState(SendScoreState.sending);
          const res = await sendScore(score || 0, urName);
          if (res) {
            alert("送信しました");
            setSendScoreState(SendScoreState.done);
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
