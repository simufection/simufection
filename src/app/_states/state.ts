import { Ball, createBalls, updateBalls } from "@/app/_states/balls";
import { Keys, updateKeys } from "@/app/_states/keys";
import { Player, updatePlayer } from "@/app/_states/player";
import { SceneState, updateSceneState } from "@/app/_states/sceneState";
import { Virus, initializeVirus, updateVirus } from "@/app/_states/virus";
import { Pref, initializePrefs, updatePrefs } from "@/app/_states/pref";
import { ParamsModel } from "@/app/_params/params";
import { policies } from "@/app/_functions/_policies/policies";
import { Map, maps } from "@/app/_states/maps";
import { kantoMap } from "@/app/_maps/kanto/map";
import { initializePolicydata, PolicyData } from "@/app/_states/policyData";

export enum PlayingState {
  title,
  selecting,
  playing,
  pausing,
  finishing,
  tutorial,
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
  editing: Objects;
  events: [number, string, any][];
  policyData: PolicyData;
  tutorialMessage: string;
};

export const initializeGameState = (
  params: ParamsModel,
  mapName: string,
  isTutorial: boolean = false
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
    case "tutorial":
      map = maps.tutorial;
      break;
    default:
      map = maps.kanto;
      break;
  }

  return {
    map: map,
    playingState: PlayingState.title,
    player: {
      points: isTutorial ? 0 : params.INITIAL_POINT,
      pt: params.INITIAL_DELTA_POINT,
      zero: isTutorial,
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
    balls: createBalls(params, map, isTutorial),
    prefs: initializePrefs(params, map.prefIds),
    virus: initializeVirus(mapName, params),
    editing: Objects.none,
    events: [[0, "game_start", {}]],
    policyData: initializePolicydata(params),
    tutorialMessage: "",
  };
};

export const updateGameState = (
  currentState: GameState,
  params: ParamsModel,
  isTutorial: boolean = false
): GameState => {
  if (currentState.playingState == PlayingState.playing) {
    const state = { ...currentState };
    const events = state.events;
    const { sceneState, playingState, sceneEvents } = updateSceneState(
      state.sceneState,
      params,
      state.balls,
      state.playingState,
      isTutorial
    );
    sceneEvents.forEach((e) => {
      events.push(e);
    });
    const { player, playerEvents } = updatePlayer(
      state.sceneState,
      state.player,
      params
    );
    playerEvents.forEach((e) => {
      events.push(e);
    });
    const { prefs, prefsEvents } = updatePrefs(
      params,
      state.prefs,
      state.balls,
      sceneState.turns
    );
    prefsEvents.forEach((e) => {
      events.push(e);
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
      events.push(e);
    });
    const { virus, virusEvents } = updateVirus(
      state.virus,
      sceneState.turns,
      params
    );
    virusEvents.forEach((e) => {
      events.push(e);
    });

    return {
      ...state,
      ...{
        playingState: playingState,
        player: player,
        sceneState: sceneState,
        prefs: prefs,
        balls: balls,
        virus: virus,
        events: events,
      },
    };
  } else {
    return currentState;
  }
};
