"use client";
import { Button } from "@/components/button";
import { InputBox } from "@/components/inputBox";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  const nav = useRouter();
  return (
    <>
      <div className="p-hoge__content">{children}</div>
      <div className="p-hoge__input-box">
        <InputBox
          className="p-hoge__input"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        />
        <Button
          className="p-hoge__submit"
          onClick={() => {
            nav.push(`/hoge/${text}`);
          }}
          label="検索"
        />
      </div>
    </>
  );
}
