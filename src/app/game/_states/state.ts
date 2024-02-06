import { INF } from "../_params/inf";
import { createBarFunc, createBarInit } from "../_functions/_policys/createBar";
import {
  createFenceFunc,
  createFenceInit,
} from "../_functions/_policys/createFence";
import { cureFaster } from "../_functions/_policys/cureFaster";
import { vaccine } from "../_functions/_policys/vaccine";
import { POLICY_PARAMS } from "../_params/policyParams";
import { ParamsModel } from "../_types/Models";
import { Ball, createBalls, updateBalls } from "./balls";
import { Bar, createBar, updateBars } from "./bars";
import { Fence, updateFences } from "./fences";
import { Keys, updateKeys } from "./keys";
import { Player, updatePlayer } from "./player";
import { RNote, updateRNote } from "./rNote";
import { SceneState, updateSceneState } from "./sceneState";
import { Virus, updateVirus } from "./virus";

export enum PlayingState {
  waiting = 0,
  playing = 1,
  pausing = 2,
  finishing = 3,
  editing = 4,
}

export enum Objects {
  none = 0,
  bar = 1,
  fence = 2,
}

export type GameState = {
  playingState: PlayingState;
  sceneState: SceneState;
  player: Player;
  balls: Ball[];
  bars: Bar[];
  fences: Fence[];
  virus: Virus;
  rNote: RNote;
  keys: Keys;
  editing: Objects;
};

export const initializeGameState = (params: ParamsModel): GameState => {
  return {
    playingState: PlayingState.waiting,
    player: {
      points: 0,
    },
    sceneState: {
      turns: 0,
      results: [],
      preResult: [0, 1, 1, 0],
      contactedCount: 0,
      infectedCount: 0,
      healedCount: 0,
    },
    balls: createBalls(params),
    bars: [
      createBar(true, -INF, -INF, INF, INF * 2),
      createBar(true, params.MAX_WIDTH, -INF, INF, INF * 2),
      createBar(false, -INF, -INF, INF * 2, INF),
      createBar(false, -INF, params.MAX_HEIGHT, INF * 2, INF),
    ],
    fences: [],
    virus: {
      prob: 0.1,
      probPower: 10,
      turnEvent: { 250: 0, 350: 1 },
      turnsRequiredForHeal: params.TURNS_REQUIRED_FOR_HEAL,
    },
    rNote: {
      resultsWIDTH: 4,
      termTurn: 0,
      termIncremental: 0,
      value: 0,
      valueMax: 0,
      valueMaxTurnBegin: 0,
      valueMaxTurnEnd: 0,
    },
    keys: {
      down: new Set<string>(),
      up: new Set<string>(),
      downAll: new Set<string>(),
    },
    editing: Objects.none,
  };
};

export const usePolicy = (state: GameState, params: ParamsModel) => {
  const { keys } = state;
  if (keys.down.has("b") && state.playingState == PlayingState.playing) {
    if (state.player.points >= POLICY_PARAMS.POINTS_FOR_BAR) {
      createBarInit(state.bars, params);
      return { playingState: PlayingState.editing, editing: Objects.bar };
    }
  }

  if (keys.down.has("f") && state.playingState == PlayingState.playing) {
    if (state.player.points >= POLICY_PARAMS.POINTS_FOR_FENCE) {
      createFenceInit(state.fences, state.bars, params);
      return { playingState: PlayingState.editing, editing: Objects.fence };
    }
  }

  if (keys.down.has("v") && state.playingState == PlayingState.playing) {
    if (state.player.points >= POLICY_PARAMS.POINTS_FOR_VACCINE) {
      const { player } = state;
      player.points -= POLICY_PARAMS.POINTS_FOR_VACCINE;
      const virus = vaccine(state);
      return { player: player, virus: virus };
    }
  }
  if (keys.down.has("c") && state.playingState == PlayingState.playing) {
    if (state.player.points >= POLICY_PARAMS.POINTS_FOR_CURE_FASTER) {
      const { player } = state;
      player.points -= POLICY_PARAMS.POINTS_FOR_CURE_FASTER;
      const virus = cureFaster(state);
      return { player: player, virus: virus };
    }
  }
};

export const updatePlayingState = (
  currentState: GameState,
  playingState: PlayingState
) => {
  const state = { ...currentState };
  state.playingState = playingState;
  return state;
};

export const updateGameState = (
  currentState: GameState,
  params: ParamsModel,
  inputKeys: Set<string>
): GameState => {
  if (currentState.playingState == PlayingState.playing) {
    const effectsOfPolicy = usePolicy(currentState, params);
    const state = { ...currentState, ...effectsOfPolicy };
    const { sceneState, playingState } = updateSceneState(
      state.sceneState,
      params,
      state.balls,
      state.playingState
    );
    const rNote = updateRNote(state.rNote, state.sceneState.results);
    const player = updatePlayer(
      state.player,
      1,
      state.sceneState.turns,
      params
    );
    const balls = updateBalls(
      state.balls,
      state.bars,
      params,
      sceneState.turns,
      state.virus
    );
    const bars = updateBars(state.bars);
    const virus = updateVirus(state.virus, sceneState.turns);

    const keys = updateKeys(state.keys, inputKeys);

    return {
      ...state,
      ...{
        playingState: playingState,
        player: player,
        sceneState: sceneState,
        balls: balls,
        bars: bars,
        virus: virus,
        rNote: rNote,
        keys: keys,
      },
    };
  } else if (currentState.playingState == PlayingState.editing) {
    const state = currentState;
    const keys = updateKeys(state.keys, inputKeys);

    let bars: Bar[];
    let fences: Fence[];

    if (state.editing == Objects.bar) {
      const { bars: newBars, res, player } = createBarFunc(state, params);
      if (res) {
        return {
          ...state,
          ...{
            keys: keys,
            playingState: PlayingState.playing,
            player: player || state.player,
          },
        };
      }
      bars = updateBars(newBars);
    }
    if (state.editing == Objects.fence) {
      const {
        bars: newBars,
        res,
        player,
        fences: newFences,
      } = createFenceFunc(state, params);
      if (res) {
        return {
          ...state,
          ...{
            keys: keys,
            playingState: PlayingState.playing,
            player: player || state.player,
          },
        };
      }
      bars = updateBars(newBars);
      fences = updateFences(newFences);
    }
    const { sceneState, playingState } = updateSceneState(
      state.sceneState,
      params,
      state.balls,
      state.playingState
    );
    return {
      ...state,
      ...{
        playingState: playingState,
        bars: bars! || state.bars,
        fences: fences! || state.fences,
        keys: keys,
        sceneState: sceneState,
      },
    };
  } else {
    return currentState;
  }
};
