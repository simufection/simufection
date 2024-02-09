"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  draw,
  drawBackground,
  drawResult,
  drawWhite,
} from "./_functions/_drawing/draw";
import useInterval from "@/hooks/useInterval";
import { Button } from "@/components/button";
import { InputBox } from "@/components/inputBox";
import useWindowSize from "@/hooks/useWindowSize";
import { usePressKey } from "@/hooks/usePressKey";
import {
  GameState,
  PlayingState,
  initializeGameState,
  updateGameState,
} from "./_states/state";
import { Params } from "./_params/params";
import { OverLay } from "@/components/overlay";
import { policies } from "./_functions/_policys/policies";

enum sendScoreStates {
  before = 0,
  pending = 1,
  finish = 2,
}

const GameView = () => {
  const [width, height] = useWindowSize();
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [offCvs, setOffCvs] = useState<HTMLCanvasElement | null>(null);
  const params = Params();

  const [gameState, setGameState] = useState<GameState>(
    initializeGameState(params)
  );

  const pressedKey = usePressKey();

  const stateNotPlaying = [PlayingState.waiting, PlayingState.finishing];
  const stateIsPlaying = [PlayingState.playing, PlayingState.pausing];

  const [score, setScore] = useState<number | null>(null);
  const [urName, setUrName] = useState("");
  const [sendScoreState, setSendScoreState] = useState(sendScoreStates.before);

  useEffect(() => {
    const canvas = document.getElementById("screen") as HTMLCanvasElement;
    const canvasctx = canvas.getContext("2d");
    setContext(canvasctx);
  }, []);

  useEffect(() => {
    if (stateNotPlaying.includes(gameState.playingState)) {
      params.setParams({
        MAX_WIDTH: Math.min(width, 640),
        MAX_HEIGHT: Math.min(
          640,
          height - params.RADIUS - params.CHART_HEIGHT - 50
        ),
      });
    }
  }, [width, height]);

  useEffect(() => {
    if (ctx && gameState.playingState == PlayingState.waiting) {
      drawWhite(ctx, params);
      setOffCvs(drawBackground(gameState.map.map, params));
    }
  }, [ctx, params]);

  useEffect(() => {
    if (ctx && gameState.playingState == PlayingState.finishing) {
      // drawResult(ctx, gameState.sceneState.results, params);
    }
  }, [gameState.playingState]);

  useInterval(() => {
    if (ctx && offCvs) {
      if (!stateNotPlaying.includes(gameState.playingState)) {
        draw(ctx, gameState, params, offCvs).render();
        setGameState(updateGameState(gameState, params, pressedKey));
      }
      if (gameState.playingState == PlayingState.finishing && !score) {
        setScore(calcScore());
      }
    }
  }, params.SLEEP_SEC * 1000);

  const startSimulate = () => {
    if (!ctx) {
      return;
    }

    setScore(null);
    updateGameStateFromGameView(
      { playingState: PlayingState.playing },
      initializeGameState(params)
    );
  };

  const quitSimulate = () => {
    if (!ctx) {
      return;
    }

    updateGameStateFromGameView(
      { playingState: PlayingState.waiting },
      initializeGameState(params)
    );

    drawWhite(ctx, params);
  };

  const updateGameStateFromGameView = (
    newState: Object,
    state: GameState = gameState
  ) => {
    setGameState({ ...state, ...newState });
  };

  const sendScore = async () => {
    setSendScoreState(sendScoreStates.pending);
    const body = JSON.stringify({
      urName: urName,
      score: score,
    });
    await fetch("/api/sendScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    }).then(async (response) => {
      setSendScoreState(sendScoreStates.finish);
      updateGameStateFromGameView({ playingState: PlayingState.waiting });
      const res = await response.json();
      if (res.success) {
        alert("登録完了しました");
      } else {
        alert(res.error);
      }
    });
  };

  const calcScore = () => {
    const contacted = gameState.sceneState.contactedCount;
    const all = params.MAX_BALLS;
    const turns = gameState.sceneState.turns;

    const survivor = all - contacted;

    const isClear = survivor == 0 ? false : true;

    const score = Math.floor(
      isClear ? (survivor * 1000) / turns + 100 : turns / 10
    );
    return score;
  };

  return (
    <div
      className={`p-game ${gameState.playingState == PlayingState.editing ? "-no-overflow" : ""}`}
      style={{
        width: params.MAX_WIDTH,
        height: params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT + 50,
      }}
    >
      <Button
        className={`p-game__start-button ${
          !ctx || gameState.playingState == PlayingState.pausing
            ? ""
            : stateNotPlaying.includes(gameState.playingState)
              ? "-start"
              : "u-bg-lb u-pg -inactive"
        }`}
        disabled={
          ![...stateNotPlaying, ...[PlayingState.pausing]].includes(
            gameState.playingState
          )
        }
        label={`${gameState.playingState == PlayingState.pausing ? "quit" : "start"}`}
        onClick={
          stateNotPlaying.includes(gameState.playingState)
            ? startSimulate
            : quitSimulate
        }
      />
      <Button
        className={`p-game__pause-button ${stateIsPlaying.includes(gameState.playingState) ? "" : " u-bg-lb u-pg -inactive"}`}
        label={`${!ctx || gameState.playingState == PlayingState.pausing ? "resume" : "pause"}`}
        disabled={!stateIsPlaying.includes(gameState.playingState)}
        onClick={() => {
          gameState.playingState == PlayingState.pausing
            ? updateGameStateFromGameView({
                playingState: PlayingState.playing,
              })
            : updateGameStateFromGameView({
                playingState: PlayingState.pausing,
              });
        }}
      />
      <div className="p-game__canvas-container">
        <canvas
          id="screen"
          width={params.MAX_WIDTH}
          height={params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT}
        >
          サポートされていません
        </canvas>
        <div className="p-game__policy-button-container">
          {policies
            .filter((policy) => policy.isActive)
            .map((policy) => (
              <Button
                key={policy.key}
                label={`${policy.label || policy.key} (${policy.point})`}
                onClick={() => {
                  if (policy.point <= gameState.player.points) {
                    updateGameStateFromGameView(policy.func(gameState, params));
                  }
                }}
                className={`p-game__policy-button ${policy.point > gameState.player.points ? "-inactive" : ""}`}
              />
            ))}
        </div>
      </div>
      {gameState.playingState === PlayingState.finishing ? (
        <>
          {gameState.sceneState.contactedCount === 1 ? (
            <div className="p-game__result">
              <div
                className="p-game__result-close"
                onClick={() =>
                  updateGameStateFromGameView({
                    playingState: PlayingState.waiting,
                  })
                }
              >
                ×
              </div>
              感染しませんでした。
            </div>
          ) : (
            <div className="p-game__result">
              <div
                className="p-game__result-close"
                onClick={() =>
                  updateGameStateFromGameView({
                    playingState: PlayingState.waiting,
                  })
                }
              >
                ×
              </div>
              <span>
                生存者数：
                {params.MAX_BALLS - gameState.sceneState.contactedCount}
              </span>

              <span>ターン数：{gameState.sceneState.turns}</span>

              <span>
                スコア：
                {score}
              </span>
              <InputBox
                disabled={sendScoreState != sendScoreStates.before}
                placeholder="プレーヤー名を入力"
                value={urName}
                onChange={(e) => setUrName(e.target.value)}
              />
              <Button
                disabled={sendScoreState != sendScoreStates.before}
                label="スコア送信"
                onClick={() => {
                  sendScore();
                }}
              />
            </div>
          )}
          <OverLay />
        </>
      ) : null}
    </div>
  );
};

export default GameView;
