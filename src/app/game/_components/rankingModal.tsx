"use strict";

import { CloseButton } from "@/components/closeButton";
import { Axios } from "@/services/axios";
import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "../contextProvoder";
import { appVersion, appVersions } from "@/consts/appVersion";
import { rank, scoreToRank } from "../_functions/_game/rank";
import Image from "next/image";

interface Props {
  rankingData: RankingData | null;
  closeModal: Function;
}

const RankingModal = (props: Props) => {
  const version = appVersion;
  const nowVer = `${version.split(".")[0]}.${version.split(".")[1]}`;
  const [ver, setVer] = useState(nowVer);
  const { rankingData, setRankingData } = useContext(GameStateContext)!;
  const [err, setErr] = useState("読み込み中です");
  const versions = appVersions
    .map((version) => {
      const [major, minor] = version.split(".");
      return `${major}.${minor}`;
    })
    .filter((value, index, self) => self.indexOf(value) === index);

  useEffect(() => {
    if (props.rankingData && !Object.keys(props.rankingData).includes(ver)) {
      setErr("読み込み中です");
      Axios.post("/api/getRanking", { version: ver }).then((res) => {
        if (res.data.success) {
          setRankingData({
            ...rankingData,
            ...{ [ver]: { all: res.data.all, today: res.data.today } },
          });
        } else {
          setErr("データのロードに失敗しました");
        }
      });
    }
  }, [ver]);

  return (
    <div className="p-ranking">
      <div className="p-ranking__header">
        <select
          className="p-ranking__version"
          onChange={(e) => {
            setVer(e.target.value);
          }}
          value={ver}
        >
          {versions.map((v, index) => (
            <option key={index} value={v}>
              {v}
            </option>
          ))}
        </select>
        <CloseButton
          onClick={() => props.closeModal()}
          addClass="p-ranking__close-button"
        />
      </div>
      {props.rankingData && Object.keys(props.rankingData).includes(ver) ? (
        <div className="p-ranking__container">
          <div className="p-ranking__all">
            <li className="p-ranking__row">{`スコアランキング`}</li>
            {props.rankingData[ver].all.map((item, index) => (
              <li key={index} className="p-ranking__row">
                <Image
                  className="p-ranking__rank-image"
                  alt="rank"
                  src={scoreToRank(item.score).image}
                />
                <div className="p-ranking__urname">{item.urName}</div>
                <div>{item.score}</div>
              </li>
            ))}
          </div>
          {ver == nowVer ? (
            <div className="p-ranking__today">
              <li className="p-ranking__row">今日のランキング</li>
              {props.rankingData[ver].today.map((item, index) => (
                <li key={index} className="p-ranking__row">
                  <Image
                    className="p-ranking__rank-image"
                    alt="rank"
                    src={scoreToRank(item.score).image}
                  />
                  <div className="p-ranking__urname">{item.urName}</div>
                  <div>{item.score}</div>
                </li>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <>{err}</>
      )}
    </div>
  );
};

export default RankingModal;
