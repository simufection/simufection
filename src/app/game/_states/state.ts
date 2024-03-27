import { Ball, createBalls, updateBalls } from "./balls";
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
  prefs: { [name: number]: Pref };
  virus: Virus;
  rNote: RNote;
  keys: Keys;
  editing: Objects;
  events: string[];
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
    case "shikoku":
      map = maps.shikoku;
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
      points: 3,
      pt: params.INITIAL_DELTA_POINT,
    },
    sceneState: {
      turns: 0,
      results: [],
      preResult: [0, 1, 1, 0, 0],
      contactedCount: 0,
      infectedCount: 0,
      healedCount: 0,
      deadCount: 0,
      sum_infected: 0,
      sum_dead: 0,
      sum_healed: 0,
    },
    balls: createBalls(params, map),
    prefs: initializePrefs(params, map.prefIds),
    virus: {
      prob: params.VIRUS_INITIAL_PROB,
      turnEvent: { 500: 0, 1000: 1, 1500: 0 },
      turnsRequiredForHeal: params.TURNS_REQUIRED_FOR_HEAL,
      turnsRequiredForDead: params.TURNS_REQUIRED_FOR_DEAD,
      turnsRequiredForReinfect: params.TURNS_REQUIRED_FOR_REINFECT,
      TURNS_JUDGE_HEAL: params.TURNS_JUDGE_HEAL,
      TURNS_JUDGE_DEAD: params.TURNS_JUDGE_DEAD,
      HEAL_PROB: params.HEAL_PROB,
      DEAD_PROB: params.DEAD_PROB,
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
    events: ["0: ゲーム開始！"],
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
    const events = state.events;
    const { sceneState, playingState, sceneEvents } = updateSceneState(
      state.sceneState,
      params,
      state.balls,
      state.playingState
    );
    sceneEvents.forEach((e) => {
      events.push(`${state.sceneState.turns}: ${e}`);
    });
    const rNote = updateRNote(state.rNote, state.sceneState.results);
    const { player, playerEvents } = updatePlayer(
      state.sceneState,
      state.player,
      1,
      state.sceneState.turns,
      params
    );
    playerEvents.forEach((e) => {
      events.push(`${state.sceneState.turns}: ${e}`);
    });
    const { prefs, prefsEvents } = updatePrefs(
      params,
      state.prefs,
      sceneState.turns
    );
    prefsEvents.forEach((e) => {
      events.push(`${state.sceneState.turns}: ${e}`);
    });
    const { balls, ballsEvents } = updateBalls(
      state.balls,
      params,
      sceneState.turns,
      state.virus,
      state.map,
      state.prefs
    );
    ballsEvents.forEach((e) => {
      events.push(`${state.sceneState.turns}: ${e}`);
    });
    const { virus, virusEvents } = updateVirus(
      state.virus,
      sceneState.turns,
      params
    );
    virusEvents.forEach((e) => {
      events.push(`${state.sceneState.turns}: ${e}`);
    });

    const keys = updateKeys(state.keys, inputKeys);

    return {
      ...state,
      ...{
        playingState: playingState,
        player: player,
        sceneState: sceneState,
        prefs: prefs,
        balls: balls,
        virus: virus,
        rNote: rNote,
        keys: keys,
        events: events,
      },
    };
  } else {
    return currentState;
  }
};
