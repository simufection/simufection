"use client";

import { useContext, useEffect, useRef, useState } from "react";
import {
  updateBackGround,
  drawGameScreen,
  drawOverLay,
  drawWhite,
} from "@/app/_functions/_drawing/draw";
import useInterval from "@/hooks/useInterval";
import { usePressKey } from "@/hooks/usePressKey";
import { PlayingState, updateGameState } from "@/app/_states/state";
import { policies } from "@/app/_functions/_policies/policies";

import { stateIsPlaying, stateNotPlaying } from "@/app/_params/consts";
import { GameButtons } from "@/app/_components/gameButtons";
import {
  CanvasContext,
  GameSizeContext,
  GameStateContext,
} from "@/app/contextProvoder";
import { calcScore } from "@/app/_functions/_game/score";

import PolicyIcon from "@/app/_components/policyIcon";
import { DndContext, DragEndEvent, getClientRect } from "@dnd-kit/core";
import { Droppable } from "@/components/droppable";
import { getMousePosition } from "@/app/_functions/getMousePosition";
import SelectMap from "@/app/_pages/selectView";
import RankingModal from "@/app/_pages/rankingView";
import { appVersion } from "@/consts/appVersion";
import { eventMessage } from "@/app/_params/eventMessage";

const GameView = () => {
  const { gameSize, calcGameSize } = useContext(GameSizeContext)!;
  const { ctx, createCtx } = useContext(CanvasContext)!;

  const [showRanking, setShowRanking] = useState(false);

  const {
    offCvs,
    setOffCvs,
    score,
    gameState,
    updateGameStateForce,
    setScore,
    rankingData,
    params,
  } = useContext(GameStateContext)!;

  const pressedKey = usePressKey();

  const onReady = !!(params && ctx && gameState);

  const [updateDraw, updateDrawState] = useState(false);

  useEffect(() => {
    if (params) {
      const canvas = document.getElementById("screen") as HTMLCanvasElement;
      canvas.width = params.MAX_WIDTH;
      canvas.height = params.MAX_HEIGHT + 50;
      createCtx(params);
    }
  }, [params]);

  useEffect(() => {
    updateDrawState(true);
  }, [gameState?.playingState]);

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
          gameState.playingState == PlayingState.title
        ) {
          drawWhite(ctx, params);
        } else if (gameState.playingState == PlayingState.finishing && !score) {
          setScore(calcScore(gameState, params));
        }
        updateDrawState(false);
      }
    }
  }, params?.INTERVAL * 1000 ?? 30);

  return (
    <div
      className={`p-game`}
      style={{
        width: gameSize[0],
        height: stateIsPlaying.includes(gameState?.playingState!)
          ? "100%"
          : gameSize[0],
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
              width: gameSize[0],
              height: gameSize[1],
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
            width: gameSize[0],
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
                          gameState.playingState == PlayingState.playing &&
                          gameState.policyData[policy.key].cost <=
                            gameState.player.points &&
                          (!policy.cooltime ||
                            !lastTurn ||
                            gameState.sceneState.turns >
                              policy.cooltime + lastTurn)
                        ) {
                          updateGameStateForce(
                            policy.func(
                              gameState,
                              params,
                              cvsPos,
                              mousePos,
                              gameSize[0]
                            )
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
      <GameButtons params={params} showRanking={setShowRanking} />
      {showRanking ? (
        <RankingModal
          close={() => setShowRanking(false)}
          rankingData={rankingData}
        />
      ) : null}
    </div>
  );
};

export default GameView;
