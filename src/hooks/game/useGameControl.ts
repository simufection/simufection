import { ParamsModel } from "@/app/game/_params/params";
import {
  GameState,
  PlayingState,
  initializeGameState,
} from "@/app/game/_states/state";
import { useState, useCallback } from "react";

export enum SendScoreState {
  before = 0,
  sending = 1,
  done = 2,
}

function useGameControl() {
  const [gameState, setGameState] = useState<GameState>();
  const [score, setScore] = useState<number | null>(null);
  const [mapName, setMap] = useState("kanto");

  const [sendScoreState, setSendScoreState] = useState(SendScoreState.before);

  const startSimulate = useCallback(
    (params: ParamsModel, onReady: boolean, map: string) => {
      if (!onReady) {
        return;
      }

      setSendScoreState(SendScoreState.before);
      setScore(null);
      setGameState({
        ...initializeGameState(params, mapName),
        playingState: PlayingState.playing,
      });
    },
    [gameState]
  );

  const quitSimulate = useCallback(
    (params: ParamsModel, onReady: boolean, ctx: CanvasRenderingContext2D) => {
      if (!onReady) {
        return;
      }

      setGameState({
        ...initializeGameState(params, mapName),
        playingState: PlayingState.waiting,
      });
    },
    [gameState]
  );

  const updateGameStateFromGameView = useCallback(
    (newState: Object, state: GameState | undefined = gameState) => {
      setGameState({ ...state, ...newState } as GameState);
    },
    [gameState]
  );

  return {
    mapName,
    score,
    gameState,
    sendScoreState,
    startSimulate,
    quitSimulate,
    updateGameStateFromGameView,
    setGameState,
    setScore,
    setSendScoreState,
    setMap,
  };
}

export default useGameControl;
