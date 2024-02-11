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

  const [sendScoreState, setSendScoreState] = useState(SendScoreState.before);

  const startSimulate = useCallback(
    (params: ParamsModel, onReady: boolean) => {
      if (!onReady) {
        return;
      }

      setSendScoreState(SendScoreState.before);
      setScore(null);
      setGameState({
        ...initializeGameState(params),
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
        ...initializeGameState(params),
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
    score,
    gameState,
    sendScoreState,
    startSimulate,
    quitSimulate,
    updateGameStateFromGameView,
    setGameState,
    setScore,
    setSendScoreState,
  };
}

export default useGameControl;
