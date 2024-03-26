import {
  drawBackground,
  drawWhite,
  initializeBackground,
} from "@/app/game/_functions/_drawing/draw";
import { ParamsModel } from "@/app/game/_params/params";
import { maps } from "@/app/game/_states/maps";
import {
  GameState,
  PlayingState,
  initializeGameState,
} from "@/app/game/_states/state";
import { useState, useCallback, Dispatch } from "react";

export enum SendScoreState {
  before = 0,
  sending = 1,
  done = 2,
}

export type GameControl = {
  offCvs: HTMLCanvasElement | null;
  mapName: string;
  score: number | null;
  gameState: GameState | undefined;
  sendScoreState: SendScoreState;
  startSimulate: Function;
  quitSimulate: Function;
  updateGameStateForce: Function;
  rankingData: RankingData | null;
  setGameState: Dispatch<GameState>;
  setScore: Dispatch<number | null>;
  setSendScoreState: Dispatch<SendScoreState>;
  setMap: Dispatch<string>;
  setOffCvs: Dispatch<HTMLCanvasElement | null>;
  setRankingData: Dispatch<RankingData | null>;
};

const useGameControl = (): GameControl => {
  const [gameState, setGameState] = useState<GameState>();
  const [score, setScore] = useState<number | null>(null);
  const [mapName, setMap] = useState(Object.keys(maps)[0]);
  const [offCvs, setOffCvs] = useState<HTMLCanvasElement | null>(null);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);

  const [sendScoreState, setSendScoreState] = useState(SendScoreState.before);

  const startSimulate = useCallback(
    (params: ParamsModel, onReady: boolean, newMap: string) => {
      if (!onReady) {
        return;
      }

      setMap(newMap);
      setOffCvs(initializeBackground(maps[newMap].map, params));
      setSendScoreState(SendScoreState.before);
      setScore(null);
      setGameState({
        ...initializeGameState(params, newMap),
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

      drawWhite(ctx, params);
      setGameState({
        ...initializeGameState(params, mapName),
        playingState: PlayingState.waiting,
      });
    },
    [gameState]
  );

  const updateGameStateForce = useCallback(
    (newState: Object, state: GameState | undefined = gameState) => {
      setGameState({ ...state, ...newState } as GameState);
    },
    [gameState]
  );

  return {
    offCvs,
    mapName,
    score,
    gameState,
    sendScoreState,
    rankingData,
    startSimulate,
    quitSimulate,
    updateGameStateForce,
    setGameState,
    setScore,
    setSendScoreState,
    setMap,
    setOffCvs,
    setRankingData,
  };
};

export default useGameControl;
