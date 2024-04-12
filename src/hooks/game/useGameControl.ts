import {
  drawBackground,
  drawWhite,
  initializeBackground,
} from "@/app/_functions/_drawing/draw";
import { ParamsModel } from "@/app/_params/params";
import { maps } from "@/app/_states/maps";
import {
  GameState,
  PlayingState,
  initializeGameState,
} from "@/app/_states/state";
import { useState, useCallback, Dispatch } from "react";

export enum SendScoreState {
  before = 0,
  sending = 1,
  done = 2,
}

export type GameControl = {
  offCvs: HTMLCanvasElement | null;
  mapName: string;
  score: number;
  gameState: GameState | undefined;
  sendScoreState: SendScoreState;
  startSimulate: Function;
  quitSimulate: Function;
  updateGameStateForce: Function;
  rankingData: RankingData | null;
  setGameState: Dispatch<GameState>;
  setScore: Dispatch<number>;
  setSendScoreState: Dispatch<SendScoreState>;
  setMap: Dispatch<string>;
  setOffCvs: Dispatch<HTMLCanvasElement | null>;
  setRankingData: Dispatch<RankingData | null>;
  params: ParamsModel | null;
  setParams: Dispatch<ParamsModel>;
};

const useGameControl = (): GameControl => {
  const [gameState, setGameState] = useState<GameState>();
  const [score, setScore] = useState<number>(0);
  const [mapName, setMap] = useState(Object.keys(maps)[0]);
  const [offCvs, setOffCvs] = useState<HTMLCanvasElement | null>(null);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [params, setParams] = useState<ParamsModel | null>(null);

  const [sendScoreState, setSendScoreState] = useState(SendScoreState.before);

  const startSimulate = useCallback(
    (params: ParamsModel, newMap: string) => {
      setMap(newMap);
      setOffCvs(initializeBackground(maps[newMap].map, params));
      setSendScoreState(SendScoreState.before);
      setScore(0);
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
        playingState: PlayingState.title,
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
    params,
    setParams,
  };
};

export default useGameControl;
