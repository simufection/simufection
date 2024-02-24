import { ParamsModel } from "../_params/params";
import { Ball } from "./balls";
import { PlayingState } from "./state";

export type SceneState = {
  turns: number;
  results: FixedLengthArray<number, 5>[];
  preResult: FixedLengthArray<number, 4>;
  contactedCount: number;
  infectedCount: number;
  healedCount: number;
};

const updateResults = (state: SceneState, params: ParamsModel) => {
  const results = [...state.results];
  const preResult = [...state.preResult];
  if (
    state.contactedCount !== preResult[1] ||
    state.infectedCount !== preResult[2] ||
    state.healedCount !== preResult[3]
  ) {
    results.push([
      state.turns,
      state.contactedCount,
      state.infectedCount,
      state.healedCount,
      params.MAX_BALLS - state.contactedCount,
    ]);
  }
  return {
    results: results,
    preResult: [
      state.turns,
      state.contactedCount,
      state.infectedCount,
      state.healedCount,
    ] as FixedLengthArray<number, 4>,
  };
};

const updateTurns = (
  turns: number,
  counts: { contactedCount: number; infectedCount: number },
  params: ParamsModel,
  playingState: PlayingState
) => {
  if (playingState == PlayingState.playing) {
    let { contactedCount, infectedCount } = counts;
    if (contactedCount >= params.MAX_BALLS) {
      console.log("End ... All balls are infected.");
      playingState = PlayingState.finishing;
    } else if (infectedCount === 0) {
      console.log("End ... The infected ball is gone.");
      playingState = PlayingState.finishing;
    } else {
      turns += 1;
    }
  }

  return { turns: turns, playingState: playingState };
};

const updateCount = (balls: Ball[], params: ParamsModel) => {
  let [contactedCount, infectedCount, healedCount] = [0, 0, 0];
  balls.forEach((ball) => {
    if (ball.contacted) contactedCount++;
    if (ball.contacted && !ball.healed && !ball.dead) infectedCount++;
    if (ball.healed) healedCount++;
  });

  return {
    contactedCount: contactedCount,
    infectedCount: infectedCount,
    healedCount: healedCount,
  };
};

export const updateSceneState = (
  state: SceneState,
  params: ParamsModel,
  balls: Ball[],
  currentPlaying: PlayingState
): { sceneState: SceneState; playingState: PlayingState } => {
  const newCounts = updateCount(balls, params);
  const newResults = updateResults(state, params);
  const { turns, playingState } = updateTurns(
    state.turns,
    newCounts,
    params,
    currentPlaying
  );

  return {
    sceneState: {
      ...state,
      ...newResults,
      ...{ turns: turns },
      ...newCounts,
    },
    playingState: playingState,
  };
};
