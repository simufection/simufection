"use client";

import { useContext, useEffect, useRef, useState } from "react";
import {
  drawBackground,
  updateBackGround,
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
import { policies } from "./_functions/_policys/policies";
import { listToDict } from "@/services/listToDict";

import useWindowSize from "@/hooks/useWindowSize";
import { stateIsPlaying, stateNotPlaying } from "./_params/consts";
import { GameButtons } from "./_components/gameButtons";
import { GameStateContext } from "./contextProvoder";
import { calcScore } from "./_functions/_game/score";
import Image from "next/image";

import { Axios } from "@/services/axios";
import titleImage from "@/assets/img/simufection-title.png";
import { SendScoreState } from "@/hooks/game/useGameControl";
import PolicyIcon from "./_components/policyIcon";
import { useGetElementProperty } from "@/hooks/useGetElementProperty";
import { DndContext, DragEndEvent, getClientRect } from "@dnd-kit/core";
import useMousePosition from "@/hooks/useMousePosition";
import { Droppable } from "@/components/droppable";
import { getMousePosition } from "@/app/game/_functions/getMousePosition";
import { Pref } from "./_states/pref";
import SendScoreInput from "./_components/sendScoreInput";
import SelectMap from "./_components/selectMap";
import RankingModal from "./_components/rankingModal";
import { appVersion } from "@/consts/appVersion";
import { eventMessage } from "./_params/eventMessage";
import Result from "./_components/result";

const GameView = () => {
  const [w, h] = useWindowSize();
  const [[sw, sh], setScreenSize] = useState([0, 0]);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const [showRanking, setShowRanking] = useState(false);

  const {
    offCvs,
    setOffCvs,
    mapName,
    score,
    gameState,
    updateGameStateForce,
    setScore,
    rankingData,
    setRankingData,
  } = useContext(GameStateContext)!;

  const [params, setParams] = useState<ParamsModel | null>(null);

  const pressedKey = usePressKey();

  const onReady = !!(params && ctx && gameState);

  const [updateDraw, updateDrawState] = useState(false);

  const version = appVersion;
  const ver = `${version.split(".")[0]}.${version.split(".")[1]}`;

  useEffect(() => {
    const canvas = document.getElementById("screen") as HTMLCanvasElement;
    const canvasctx = canvas.getContext("2d");
    setContext(canvasctx);

    Axios.post("/api/getRanking", {}).then((res) => {
      setRankingData({
        ...rankingData,
        ...{ [ver]: { all: res.data.all, today: res.data.today } },
      });
    });

    Axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_DOC_ID}/values/${process.env.NEXT_PUBLIC_SHEET_NAME}?key=${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY}`
    )
      .then((res) => res.data)
      .then((datas) => setParams({ ...Params, ...listToDict(datas.values) }))
      .catch(() => setParams(Params));
  }, []);

  useEffect(() => {
    if (params) {
      updateGameStateForce(initializeGameState(params, mapName));

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
        screenHeight = Math.min(params.MAX_HEIGHT, h);
        screenWidth = screenHeight / canvasAspect;
      }

      setScreenSize([screenWidth, screenHeight]);
    }
  }, [params]);

  useEffect(() => {
    updateDrawState(true);
  }, [gameState?.playingState]);

  useEffect(() => {
    if (onReady && gameState.playingState == PlayingState.loading) {
      drawWhite(ctx, params);
      updateGameStateForce({ playingState: PlayingState.waiting });
    }
  }, [ctx, params, gameState, onReady]);

  useInterval(() => {
    if (onReady && offCvs) {
      if (stateIsPlaying.includes(gameState.playingState)) {
        if (
          gameState.map.prefIds.reduce((flag: boolean, prefId: number) => {
            return flag || gameState.prefs[prefId].updated;
          }, false)
        ) {
          setOffCvs(
            updateBackGround(gameState.map.map, gameState.prefs, params, offCvs)
          );
        }
        drawGameScreen(ctx, gameState, params, offCvs);
        if (gameState.playingState == PlayingState.pausing) {
          drawOverLay(ctx, params);
        } else {
          updateGameStateForce(updateGameState(gameState, params, pressedKey));
        }
      } else if (updateDraw) {
        if (
          gameState.playingState == PlayingState.selecting ||
          gameState.playingState == PlayingState.waiting
        ) {
          drawWhite(ctx, params);
        } else if (gameState.playingState == PlayingState.finishing && !score) {
          setScore(calcScore(gameState, params));
        }
        updateDrawState(false);
      }
    }
  }, 30);

  return (
    <div
      className={`p-game ${
        onReady && gameState.playingState == PlayingState.editing
          ? "-no-overflow"
          : ""
      }`}
      style={{
        width: sw,
        height: stateIsPlaying.includes(gameState?.playingState!) ? "100%" : sw,
      }}
    >
      <DndContext
        onDragEnd={async (event: DragEndEvent) => {
          const { active } = event;
          if (!active.data.current || !active.data.current.func) {
            return;
          }
          const mousePos = await getMousePosition();
          const cvsRect = getClientRect(document.getElementById("screen")!);
          const cvsPos = { x: cvsRect.left, y: cvsRect.top };

          active.data.current.func(mousePos, cvsPos);
        }}
      >
        <Droppable id="canvas" className="p-game__canvas-container">
          <canvas
            id="screen"
            style={{
              width: sw,
              height: sh,
            }}
          >
            サポートされていません
          </canvas>
        </Droppable>
        <div className="p-game__timeline-container">
          <div className="p-game__timeline">
            {onReady
              ? gameState.events
                  .toReversed()
                  .map((r) => {
                    return eventMessage(r[0], r[2])[r[1]];
                  })
                  .join("\n")
              : ""}
          </div>
        </div>

        <div
          className="p-game__policies"
          style={{
            width: sw,
          }}
        >
          {onReady && stateIsPlaying.includes(gameState.playingState)
            ? policies(params)
                .filter((policy) => policy.isActive)
                .map((policy) => {
                  const events = gameState.events.filter(
                    (e) => e[1] == `policy_${policy.key}`
                  );
                  const lastTurn =
                    events.length > 0 ? events[events.length - 1][0] : null;
                  return (
                    <PolicyIcon
                      key={policy.key}
                      id={`policy-${policy.key}`}
                      image={policy.image}
                      disabled={
                        gameState.playingState == PlayingState.pausing ||
                        gameState.policyData[policy.key].cost >
                          gameState.player.points
                      }
                      cost={gameState.policyData[policy.key].cost}
                      func={(mousePos: Position, cvsPos: Position) => {
                        if (
                          gameState.policyData[policy.key].cost <=
                            gameState.player.points &&
                          (!policy.cooltime ||
                            !lastTurn ||
                            gameState.sceneState.turns >
                              policy.cooltime + lastTurn)
                        ) {
                          updateGameStateForce(
                            policy.func(gameState, params, cvsPos, mousePos, sw)
                          );
                        }
                      }}
                      className={`p-game__policy-button ${
                        gameState.policyData[policy.key].cost >
                        gameState.player.points
                          ? "-inactive"
                          : ""
                      }`}
                      ratio={
                        policy.cooltime && lastTurn
                          ? (gameState.sceneState.turns - lastTurn) /
                            policy.cooltime
                          : 1
                      }
                    />
                  );
                })
            : null}
        </div>
      </DndContext>
      {gameState?.playingState == PlayingState.loading ? (
        <div className="p-game__loading">loading...</div>
      ) : null}
      {PlayingState.waiting == gameState?.playingState ? (
        <Image
          className="p-game__title-img"
          src={titleImage}
          alt="title"
          style={{ width: sw, height: sh }}
          priority
        />
      ) : null}
      <GameButtons params={params} ctx={ctx} showRanking={setShowRanking} />
      {onReady && gameState.playingState == PlayingState.selecting ? (
        <SelectMap params={params} ctx={ctx} />
      ) : null}
      {onReady && gameState.playingState == PlayingState.finishing ? (
        <Result state={gameState} score={score ?? 0} />
      ) : null}
      {showRanking ? (
        <RankingModal
          closeModal={() => setShowRanking(false)}
          rankingData={rankingData}
        />
      ) : null}
    </div>
  );
};

export default GameView;
