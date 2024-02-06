"use client";
import { Button } from "@/components/button";
import { InputBox } from "@/components/inputBox";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const nav = useRouter();

  const params = useSearchParams()!;

  const [name, setName] = useState(params.get("color") || "");
  const [name_two, setName2] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {}, []);

  const registerColor = async () => {
    if (
      name.match(/[^a-z]/gi) ||
      name == "" ||
      name_two.match(/[^a-z]/gi) ||
      name_two.length != 2 ||
      code.match(/[^a-f0-9]/gi) ||
      code.length != 6
    ) {
      alert("フォーマットに従ってください");
      return;
    }
    const body = JSON.stringify({
      name: name,
      name_two: name_two,
      code: code,
    });
    await fetch("/api/colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    }).then(async (response) => {
      const res = await response.json();
      if (res.success) {
        if (!alert("登録完了しました")!) {
          nav.push(`./${name}`);
        }
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <>
      <div className="p-hoge-setting">
        <span className="p-hoge-setting__title">Setting</span>

        <InputBox
          className="p-hoge-setting__input"
          value={name}
          placeholder="色の英語を入力"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <InputBox
          className="p-hoge-setting__input"
          value={name_two}
          placeholder="２文字略称を入力"
          onChange={(e) => {
            setName2(e.target.value);
          }}
        />
        <InputBox
          className="p-hoge-setting__input"
          value={code}
          placeholder="カラーコードを入力"
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <div className="p-hoge-setting__buttons">
          <Button
            label="登録"
            onClick={registerColor}
            className="u-bg-gr u-bk u-mr16"
          />
          <Button label="キャンセル" onClick={nav.back} />
        </div>
      </div>
    </>
  );
};
export default Page;
