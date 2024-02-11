"use client";

import { useContext, useEffect, useState } from "react";
import {
  drawBackground,
  drawGameScreen,
  drawOverLay,
  drawResult,
  drawWhite,
} from "./_functions/_drawing/draw";
import useInterval from "@/hooks/useInterval";
import { Button } from "@/components/button";
import { InputBox } from "@/components/inputBox";
import { usePressKey } from "@/hooks/usePressKey";
import {
  PlayingState,
  initializeGameState,
  updateGameState,
} from "./_states/state";
import { Params, ParamsModel } from "./_params/params";
import { OverLay } from "@/components/overlay";
import { policies } from "./_functions/_policys/policies";
import { listToDict } from "@/services/listToDict";

import useWindowSize from "@/hooks/useWindowSize";
import { stateIsPlaying, stateNotPlaying } from "./_params/consts";
import { GameButtons } from "./_components/gameButtons";
import { GameStateContext } from "./contextProvoder";
import { calcScore, sendScore } from "./_functions/_game/score";
import Image from "next/image";

import titleImage from "@/assets/img/title.png";
import { Axios } from "@/services/axios";
import { SendScoreState } from "@/hooks/game/useGameControl";

const GameView = () => {
  const [w, h] = useWindowSize();
  const [[sw, sh], setScreenSize] = useState([0, 0]);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [offCvs, setOffCvs] = useState<HTMLCanvasElement | null>(null);

  const {
    score,
    gameState,
    updateGameStateFromGameView,
    setScore,
    sendScoreState,
    setSendScoreState,
  } = useContext(GameStateContext);

  const [params, setParams] = useState<ParamsModel | null>(null);

  const pressedKey = usePressKey();

  const onReady = !!(params && ctx && gameState);

  const [urName, setUrName] = useState("");

  useEffect(() => {
    const canvas = document.getElementById("screen") as HTMLCanvasElement;
    const canvasctx = canvas.getContext("2d");
    setContext(canvasctx);

    Axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_DOC_ID}/values/${process.env.NEXT_PUBLIC_SHEET_NAME}?key=${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY}`
    )
      .then((res) => res.data)
      .then((datas) => setParams({ ...Params, ...listToDict(datas.values) }))
      .catch(() => setParams(Params));
  }, []);

  useEffect(() => {
    if (params) updateGameStateFromGameView(initializeGameState(params));
  }, [params]);

  useEffect(() => {
    if (params && w && h) {
      const canvas = document.getElementById("screen") as HTMLCanvasElement;
      canvas.width = params.MAX_WIDTH;
      canvas.height = params.MAX_HEIGHT + 50;
      const canvasAspect = (params.MAX_HEIGHT + 50) / params.MAX_WIDTH;
      let screenWidth = 0;
      let screenHeight = 0;
      if (w * canvasAspect <= h) {
        screenWidth = Math.min(params.MAX_WIDTH, w);
        screenHeight = screenWidth * canvasAspect;
      } else {
        screenHeight = Math.min(params.MAX_HEIGHT + 50, h);
        screenWidth = screenHeight / canvasAspect;
      }

      canvas.style.width = `${screenWidth}px`;
      canvas.style.height = `${screenHeight}px`;
      setScreenSize([screenWidth, screenHeight]);
    }
  }, [params, w, h]);

  useEffect(() => {
    if (onReady && gameState.playingState == PlayingState.loading) {
      drawWhite(ctx, params);
      setOffCvs(drawBackground(gameState.map.map, params));
      updateGameStateFromGameView({ playingState: PlayingState.waiting });
    }
  }, [ctx, params]);

  useEffect(() => {
    if (onReady && gameState.playingState == PlayingState.finishing && score) {
      drawResult(ctx, gameState.sceneState.results, gameState, params, score);
    }
  }, [gameState?.playingState, score]);

  useInterval(() => {
    if (onReady && offCvs) {
      if (!stateNotPlaying.includes(gameState.playingState)) {
        drawGameScreen(ctx, gameState, params, offCvs);
        if (gameState.playingState == PlayingState.pausing) {
          drawOverLay(ctx, params);
        } else {
          updateGameStateFromGameView(
            updateGameState(gameState, params, pressedKey)
          );
        }
      } else if (gameState.playingState == PlayingState.finishing && !score) {
        setScore(calcScore(gameState, params));
      } else {
        drawResult(ctx, gameState.sceneState.results, gameState, params, score);
      }
    }
  }, 30);

  return (
    <div
      className={`p-game ${onReady && gameState.playingState == PlayingState.editing ? "-no-overflow" : ""}`}
    >
      <div
        className="p-game__canvas-container"
        style={{
          width: sw,
          height: sh,
        }}
      >
        <canvas id="screen">サポートされていません</canvas>
        {[PlayingState.loading, PlayingState.waiting].includes(
          gameState?.playingState
        ) ? (
          <Image
            className="p-game__title-img"
            src={titleImage}
            alt="title"
            style={{ width: sw, height: sh }}
            priority
          />
        ) : null}
        <GameButtons params={params} ctx={ctx} />
        {onReady && gameState.playingState == PlayingState.finishing ? (
          gameState.sceneState.contactedCount === 1 ? null : (
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
                label={`${sendScoreState != SendScoreState.done ? "スコア送信" : "送信済"}`}
                disabled={sendScoreState != SendScoreState.before}
                onClick={async () => {
                  if (
                    urName == "" &&
                    !alert("ユーザーネームを入力してください")!
                  )
                    return;
                  setSendScoreState(SendScoreState.sending);
                  const res = await sendScore(score, urName);
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
          )
        ) : null}
      </div>
      <div
        className="p-game__policies"
        style={{
          width: w > 960 ? w - sw : sw,
          height: w > 960 ? sh : h - sh,
        }}
      >
        {onReady && stateIsPlaying.includes(gameState.playingState)
          ? policies
              .filter((policy) => policy.isActive)
              .map((policy) => (
                <Button
                  key={policy.key}
                  disabled={gameState.playingState == PlayingState.pausing}
                  label={`${policy.label || policy.key} \n (${params[policy.point]})`}
                  onClick={() => {
                    if (params[policy.point] <= gameState.player.points) {
                      updateGameStateFromGameView(
                        policy.func(gameState, params)
                      );
                    }
                  }}
                  className={`p-game__policy-button ${params[policy.point] > gameState.player.points ? "-inactive" : ""}`}
                />
              ))
          : null}
      </div>
    </div>
  );
};

export default GameView;
