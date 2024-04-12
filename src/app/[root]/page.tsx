"use client";
import { useParams, useRouter } from "next/navigation";
import GameView from "@/app/_pages/gameView";
import { useEffect, useContext } from "react";
import { GameSizeContext, GameStateContext } from "@/app/contextProvoder";
import Loading from "@/app/loading";
import { Axios } from "@/services/axios";
import { Params } from "@/app/_params/params";
import { appVersion } from "@/consts/appVersion";
import { PlayingState, initializeGameState } from "@/app/_states/state";
import { listToDict } from "@/services/listToDict";
import SelectView from "@/app/_pages/selectView";
import TitleView from "@/app/_pages/titleView";
import RankingView from "../_pages/rankingView";
import ResultView from "../_pages/resultView";

const Page = () => {
  const { root } = useParams();

  const {
    gameState,
    rankingData,
    params,
    setRankingData,
    setParams,
    updateGameStateForce,
    mapName,
  } = useContext(GameStateContext)!;
  const { calcGameSize } = useContext(GameSizeContext)!;
  const version = appVersion;
  const ver = `${version.split(".")[0]}.${version.split(".")[1]}`;

  const router = useRouter();

  useEffect(() => {
    if (!rankingData) {
      Axios.post("/api/getRanking", {}).then((res) => {
        setRankingData({ [ver]: { all: res.data.all, today: res.data.today } });
      });
    }

    if (!params) {
      Axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_DOC_ID}/values/${process.env.NEXT_PUBLIC_SHEET_NAME}?key=${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY}`
      )
        .then((res) => res.data)
        .then((datas) => setParams({ ...Params, ...listToDict(datas.values) }))
        .catch(() => setParams(Params));
      // setParams(Params);
    }
  }, []);

  useEffect(() => {
    if (params && !gameState) {
      updateGameStateForce(initializeGameState(params, mapName));
      calcGameSize(params);
    }
  }, [params]);

  useEffect(() => {
    if (root == "ranking") return;
    switch (gameState?.playingState) {
      case PlayingState.title:
        router.push("/title");
        break;
      case PlayingState.selecting:
        router.push("/select");
        break;
      case PlayingState.playing:
        router.push("/game");
        break;
      case PlayingState.pausing:
        router.push("/game");
        break;
      case PlayingState.finishing:
        router.push("/result");
        break;
      default:
        break;
    }
  }, [gameState?.playingState]);

  switch (root) {
    case "title":
      return <TitleView />;
    case "select":
      return <SelectView params={params} />;
    case "game":
      return <GameView />;
    case "ranking":
      return (
        <RankingView
          rankingData={rankingData}
          close={() => {
            router.back();
          }}
        />
      );
    case "result":
      return <ResultView />;
    default:
      return <Loading />;
  }
};

export default Page;
