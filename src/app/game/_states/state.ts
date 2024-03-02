import { INF } from "../_params/inf";
import { createBarFunc, createBarInit } from "../_functions/_policys/createBar";
import {
  createFenceFunc,
  createFenceInit,
} from "../_functions/_policys/createFence";
import { Ball, createBalls, updateBalls } from "./balls";
import { Bar, createBar, updateBars } from "./bars";
import { Fence, updateFences } from "./fences";
import { Keys, updateKeys } from "./keys";
import { Player, updatePlayer } from "./player";
import { RNote, updateRNote } from "./rNote";
import { SceneState, updateSceneState } from "./sceneState";
import { Virus, updateVirus } from "./virus";
import { Pref, initializePrefs, updatePrefs } from "./pref";
import { ParamsModel } from "../_params/params";
import { policies } from "../_functions/_policys/policies";
import { Map, maps } from "./maps";
import { kantoMap } from "../_maps/kanto/map";

export enum PlayingState {
  loading = 0,
  waiting = 1,
  playing = 2,
  pausing = 3,
  finishing = 4,
  editing = 5,
  selecting = 6,
}

export enum Objects {
  none = 0,
  bar = 1,
  fence = 2,
}

export type GameState = {
  map: Map;
  playingState: PlayingState;
  sceneState: SceneState;
  player: Player;
  balls: Ball[];
  bars: Bar[];
  fences: Fence[];
  prefs: { [name: number]: Pref };
  virus: Virus;
  rNote: RNote;
  keys: Keys;
  editing: Objects;
};

export const initializeGameState = (
  params: ParamsModel,
  mapName: string
): GameState => {
  let map: Map;
  switch (mapName) {
    case "tohoku":
      map = maps.tohoku;
      break;
    case "kanto":
      map = maps.kanto;
      break;
    case "chubu":
      map = maps.chubu;
      break;
    case "kinki":
      map = maps.kinki;
      break;
    case "chugoku":
      map = maps.chugoku;
      break;
    case "kyushu":
      map = maps.kyushu;
      break;
    default:
      map = maps.kanto;
  }

  return {
    map: map,
    playingState: PlayingState.loading,
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
    balls: createBalls(params, map),
    bars: [
      createBar(true, -INF, -INF, INF, INF * 2),
      createBar(true, params.MAX_WIDTH, -INF, INF, INF * 2),
      createBar(false, -INF, -INF, INF * 2, INF),
      createBar(false, -INF, params.MAX_HEIGHT, INF * 2, INF),
    ],
    fences: [],
    prefs: initializePrefs(params, map.prefIds),
    virus: {
      prob: params.VIRUS_INITIAL_PROB,
      turnEvent: { 250: 0, 350: 1, 450: 0 },
      turnsRequiredForHeal: params.TURNS_REQUIRED_FOR_HEAL,
      turnsRequiredForDead: params.TURNS_REQUIRED_FOR_DEAD,
      turnsRequiredForReinfect: params.TURNS_REQUIRED_FOR_REINFECT,
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

// export const usePolicy = (state: GameState, params: ParamsModel): Object => {
//   const { keys } = state;
//   policies
//     .filter((policy) => policy.isActive)
//     .forEach((policy) => {
//       if (keys.down.has(policy.key)) return policy.func(state, params);
//     });
//   return state;
// };

export const updateGameState = (
  currentState: GameState,
  params: ParamsModel,
  inputKeys: Set<string>
): GameState => {
  if (currentState.playingState == PlayingState.playing) {
    // const effectsOfPolicy = usePolicy(currentState, params);
    // const state = { ...currentState, ...effectsOfPolicy };
    const state = { ...currentState };
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
    const prefs = updatePrefs(params, state.prefs, sceneState.turns);
    const balls = updateBalls(
      state.balls,
      state.bars,
      params,
      sceneState.turns,
      state.virus,
      state.map,
      state.prefs
    );
    const bars = updateBars(state.bars);
    const virus = updateVirus(state.virus, sceneState.turns, params);

    const keys = updateKeys(state.keys, inputKeys);

    return {
      ...state,
      ...{
        playingState: playingState,
        player: player,
        sceneState: sceneState,
        prefs: prefs,
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
