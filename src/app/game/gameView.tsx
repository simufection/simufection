"use client";

import { ReactNode, useEffect, useState } from "react";
import { draw, drawResult, drawWhite } from "./_functions/_drawing/draw";
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
  updatePlayingState,
} from "./_states/state";
import { Params } from "./_params/params";
import { OverLay } from "@/components/overlay";

enum sendScoreStates {
  before = 0,
  pending = 1,
  finish = 2,
}

const GameView = () => {
  const [width, height] = useWindowSize();
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const params = Params();

  const [gameState, setGameState] = useState<GameState>(
    initializeGameState(params)
  );

  const pressedKey = usePressKey();

  const stateNotPlaying = [PlayingState.waiting, PlayingState.finishing];
  const stateIsPlaying = [PlayingState.playing, PlayingState.pausing];

  const [score, setScore] = useState<number>();
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
        MAX_HEIGHT: Math.min(640, height - params.CHART_HEIGHT - params.RADIUS),
      });
    }
  }, [width, height]);

  useEffect(() => {
    if (ctx && gameState.playingState == PlayingState.waiting) {
      drawWhite(ctx, params);
    }
  }, [ctx]);

  useEffect(() => {
    if (ctx && gameState.playingState == PlayingState.finishing) {
      drawResult(ctx, gameState.sceneState.results, params);
    }
  }, [gameState.playingState]);

  useInterval(() => {
    if (ctx) {
      if (!stateNotPlaying.includes(gameState.playingState)) {
        draw(ctx, gameState, params).render();
        setGameState(updateGameState(gameState, params, pressedKey));
      }
      if (gameState.playingState == PlayingState.finishing && !score) {
        setScore(
          Math.floor(
            (gameState.sceneState.contactedCount * 1000) /
              gameState.sceneState.turns
          )
        );
      }
    }
  }, params.SLEEP_SEC * 1000);

  const startSimulate = () => {
    if (!ctx) {
      return;
    }

    updatePlayingStateFromGameView(
      PlayingState.playing,
      initializeGameState(params)
    );
  };

  const quitSimulate = () => {
    if (!ctx) {
      return;
    }

    updatePlayingStateFromGameView(
      PlayingState.waiting,
      initializeGameState(params)
    );

    drawWhite(ctx, params);
  };
  const updatePlayingStateFromGameView = (
    playingState: PlayingState,
    state: GameState = gameState
  ) => {
    setGameState(updatePlayingState(state, playingState));
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
      updatePlayingStateFromGameView(PlayingState.waiting);
      const res = await response.json();
      if (res.success) {
        alert("登録完了しました");
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div
      className={`p-game ${gameState.playingState == PlayingState.editing ? "-no-overflow" : ""}`}
    >
      <div className="p-game__props">
        <div className="p-game__buttons">
          <Button
            className={`p-game__button ${
              !ctx ||
              [...stateNotPlaying, ...[PlayingState.pausing]].includes(
                gameState.playingState
              )
                ? ""
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
            className={`p-game__button ${stateIsPlaying.includes(gameState.playingState) ? "" : " u-bg-lb u-pg -inactive"}`}
            label={`${!ctx || gameState.playingState == PlayingState.pausing ? "resume" : "pause"}`}
            disabled={!stateIsPlaying.includes(gameState.playingState)}
            onClick={() => {
              gameState.playingState == PlayingState.pausing
                ? updatePlayingStateFromGameView(PlayingState.playing)
                : updatePlayingStateFromGameView(PlayingState.pausing);
            }}
          />
        </div>
        <span className="p-game__span"> width</span>
        <InputBox
          className="p-game__input"
          type="number"
          value={params.MAX_WIDTH}
          disabled={!stateNotPlaying.includes(gameState.playingState)}
          onChange={(e) => {
            if (
              stateNotPlaying.includes(gameState.playingState) &&
              width > parseInt(e.target.value)
            ) {
              params.setParams({ MAX_WIDTH: parseInt(e.target.value) });
            }
          }}
        />
        <span className="p-game__span"> height</span>
        <InputBox
          className="p-game__input"
          type="number"
          disabled={!stateNotPlaying.includes(gameState.playingState)}
          value={params.MAX_HEIGHT}
          onChange={(e) => {
            if (
              stateNotPlaying.includes(gameState.playingState) &&
              height > parseInt(e.target.value)
            ) {
              params.setParams({ MAX_HEIGHT: parseInt(e.target.value) });
            }
          }}
        />
        <span className="p-game__span">balls num</span>
        <InputBox
          className="p-game__input"
          value={params.MAX_BALLS}
          type="number"
          disabled={!stateNotPlaying.includes(gameState.playingState)}
          onChange={(e) => {
            if (stateNotPlaying.includes(gameState.playingState)) {
              if (
                e.target.value.match(/[^0-9]/gi) &&
                e.target.value.length == 0
              ) {
                alert(`半角数字で整数値を入力してください`);
              } else if (parseInt(e.target.value) > params.MAX_BALLS_NUM) {
                alert(`${params.MAX_BALLS_NUM}以下の数字を入力してください`);
              } else {
                params.setParams({ MAX_BALLS: parseInt(e.target.value) });
              }
            }
          }}
        />
        <span className="p-game__span">radius</span>
        <InputBox
          className="p-game__input"
          value={params.RADIUS}
          disabled={!stateNotPlaying.includes(gameState.playingState)}
          type="number"
          onChange={(e) => {
            if (stateNotPlaying.includes(gameState.playingState)) {
              params.setParams({ RADIUS: parseInt(e.target.value) });
            }
          }}
        />
        <span className="p-game__span">turns required for heal</span>
        <InputBox
          className="p-game__input"
          type="number"
          disabled={!stateNotPlaying.includes(gameState.playingState)}
          value={params.TURNS_REQUIRED_FOR_HEAL}
          onChange={(e) => {
            if (stateNotPlaying.includes(gameState.playingState)) {
              params.setParams({
                TURNS_REQUIRED_FOR_HEAL: parseInt(e.target.value),
              });
            }
          }}
        />
        <span className="p-game__span">ratio of balls stopped</span>
        <InputBox
          className="p-game__input"
          disabled={!stateNotPlaying.includes(gameState.playingState)}
          value={params.RATIO_OF_BALLS_STOPPED}
          onChange={(e) => {
            if (stateNotPlaying.includes(gameState.playingState)) {
              params.setParams({
                RATIO_OF_BALLS_STOPPED: parseFloat(e.target.value),
              });
            }
          }}
        />
      </div>
      <div className="p-game__canvas-container">
        <canvas
          id="screen"
          width={params.MAX_WIDTH}
          height={params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT}
        >
          サポートされていません
        </canvas>
      </div>
      {gameState.playingState === PlayingState.finishing ? (
        <>
          {gameState.sceneState.contactedCount === 1 ? (
            <div className="p-game__result">感染しませんでした。</div>
          ) : (
            <div className="p-game__result">
              <div
                className="p-game__result-close"
                onClick={() =>
                  updatePlayingStateFromGameView(PlayingState.waiting)
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
