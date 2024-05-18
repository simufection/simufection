"use client";
import { Button } from "@/components/button";
import { InputBox } from "@/components/inputBox";
import { Axios } from "@/services/axios";
import { formatDate } from "@/services/formatDate";
import { useEffect, useState } from "react";

export const Prize = () => {
  const [name, setName] = useState("");
  const [realName, setRealName] = useState("");
  const [score, setScore] = useState(0);
  const [pass, setPass] = useState("");

  const sendPrize = () => {
    if (!name || !score || !realName) {
      alert("入力を完了してください");
      return;
    }
    if (pass != "simufection119") {
      alert("パスワードが違います");
      return;
    }
    if (score < 80000) {
      alert("プライズ対象外です");
      return;
    }
    Axios.post("/api/receivePrize", { name, realName, score }).then((res) => {
      if (!res.data.success) {
        alert(res.data.error);
      } else {
        alert("登録が完了しました!");
        setName("");
        setScore(0);
        setRealName("");
      }
    });
  };
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>プライズ登録用(関係者以外は送信不可能)</span>
        <InputBox
          className="p-score-input__result-input u-my36"
          placeholder="登録したプレーヤー名を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputBox
          className="p-score-input__result-input u-my36"
          placeholder="登録したスコアを入力"
          value={score}
          type="number"
          onChange={(e) => setScore(parseInt(e.target.value))}
        />
        <InputBox
          className="p-score-input__result-input u-my36"
          placeholder="本名を入力"
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
        />
        <InputBox
          className="p-score-input__result-input u-my36"
          placeholder="パスワード"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Button label="プライズを受け取る" onClick={sendPrize} />
      </div>
    </>
  );
};
