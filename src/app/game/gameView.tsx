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
import { calcScore, sendScore } from "./_functions/_game/score";
import Image from "next/image";

import { Axios } from "@/services/axios";
import titleImage from "@/assets/img/title.png";
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

const GameView = () => {
  const [w, h] = useWindowSize();
  const [[sw, sh], setScreenSize] = useState([0, 0]);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const {
    offCvs,
    setOffCvs,
    mapName,
    score,
    gameState,
    updateGameStateFromGameView,
    setScore,
  } = useContext(GameStateContext)!;

  const [params, setParams] = useState<ParamsModel | null>(null);

  const pressedKey = usePressKey();

  const onReady = !!(params && ctx && gameState);

  const [updateDraw, updateDrawState] = useState(false);

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
    if (params) {
      updateGameStateFromGameView(initializeGameState(params, mapName));

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

      setScreenSize([screenWidth, screenHeight]);
    }
  }, [params]);

  useEffect(() => {
    if (onReady && gameState.playingState == PlayingState.loading) {
      drawWhite(ctx, params);
      updateGameStateFromGameView({ playingState: PlayingState.waiting });
    }
  }, [ctx, params, gameState, onReady]);

  useEffect(() => {
    if (onReady && gameState.playingState == PlayingState.finishing && score) {
      drawResult(ctx, gameState.sceneState.results, gameState, params, score);
    }
    updateDrawState(true);
  }, [gameState?.playingState, score]);

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
          updateGameStateFromGameView(
            updateGameState(gameState, params, pressedKey)
          );
        }
      } else if (updateDraw) {
        if (
          gameState.playingState == PlayingState.selecting ||
          gameState.playingState == PlayingState.waiting
        ) {
          drawWhite(ctx, params);
        } else if (gameState.playingState == PlayingState.finishing && !score) {
          setScore(calcScore(gameState, params));
        } else {
          drawResult(
            ctx,
            gameState.sceneState.results,
            gameState,
            params,
            score
          );
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

        <div
          className="p-game__policies"
          style={{
            width: sw,
          }}
        >
          {onReady && stateIsPlaying.includes(gameState.playingState)
            ? policies
                .filter((policy) => policy.isActive)
                .map((policy) => (
                  <PolicyIcon
                    key={policy.key}
                    id={`policy-${policy.key}`}
                    image={policy.image}
                    disabled={
                      gameState.playingState == PlayingState.pausing ||
                      params[policy.point] > gameState.player.points
                    }
                    cost={params[policy.point]}
                    func={(mousePos: Position, cvsPos: Position) => {
                      if (params[policy.point] <= gameState.player.points) {
                        updateGameStateFromGameView(
                          policy.func(gameState, params, cvsPos, mousePos, sw)
                        );
                      }
                    }}
                    className={`p-game__policy-button ${
                      params[policy.point] > gameState.player.points
                        ? "-inactive"
                        : ""
                    }`}
                  />
                ))
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
      <GameButtons params={params} ctx={ctx} />
      {onReady && gameState.playingState == PlayingState.finishing ? (
        gameState.sceneState.contactedCount === 1 ? null : (
          <SendScoreInput />
        )
      ) : null}
      {onReady && gameState.playingState == PlayingState.selecting ? (
        <SelectMap params={params} ctx={ctx} />
      ) : null}
    </div>
  );
};

export default GameView;
