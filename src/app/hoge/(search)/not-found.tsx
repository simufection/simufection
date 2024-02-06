"use client";
import { useParams, useRouter } from "next/navigation";

const ErrorPage = () => {
  const { color } = useParams();
  const nav = useRouter();
  return (
    <>
      <div className="p-hoge__colorbox -gradbox" />
      <div className="p-hoge__spans">
        <div className="p-hoge__span">
          <span>{`${color}という色は存在しません。`}</span>
        </div>
        <div className="p-hoge__span">
          <span className="p-hoge__link" onClick={() => nav.push("./")}>
            TOP
          </span>
          へ戻る
        </div>
        <div className="p-hoge__span">
          <span
            className="p-hoge__link"
            onClick={() => nav.push(`./setting?color=${color}`)}
          >
            新規登録
          </span>
          する
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
