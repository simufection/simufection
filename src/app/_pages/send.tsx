"use client";
import { Button } from "@/components/button";
import { InputBox } from "@/components/inputBox";
import { Axios } from "@/services/axios";
import { formatDate } from "@/services/formatDate";
import { useEffect, useState } from "react";
import { sendScore } from "../_functions/_game/score";

export const Send = () => {
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [pass, setPass] = useState("");
  const send = async () => {
    if (!score || !name) {
      alert("入力を完了してください");
      return;
    }
    if (pass != "simufection119") {
      alert("パスワードが違います");
      return;
    }
    const res = await sendScore(score, name, "", null, null, null);
    if (res) {
      alert("登録が完了しました!");
      setName("");
      setScore(0);
    } else {
      alert("登録に失敗しました");
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>データ登録用(関係者以外は送信不可能)</span>
        <InputBox
          className="p-score-input__result-input u-my36"
          placeholder="プレーヤー名を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputBox
          className="p-score-input__result-input u-my36"
          placeholder="スコアを入力"
          value={score}
          type="number"
          onChange={(e) => setScore(parseInt(e.target.value))}
        />
        <InputBox
          className="p-score-input__result-input u-my36"
          placeholder="パスワード"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Button label="登録する" onClick={send} />
      </div>
    </>
  );
};
