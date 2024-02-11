import { ParamsModel } from "@/app/game/_params/params";
import {
  GameState,
  PlayingState,
  initializeGameState,
} from "@/app/game/_states/state";
import { useState, useCallback } from "react";

function useGameControl() {
  const [gameState, setGameState] = useState<GameState>();
  const [score, setScore] = useState<number | null>(null);

  const startSimulate = useCallback(
    (params: ParamsModel, onReady: boolean) => {
      if (!onReady) {
        return;
      }

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
    startSimulate,
    quitSimulate,
    updateGameStateFromGameView,
    setGameState,
    setScore,
  };
}

export default useGameControl;
