import { ParamsModel } from "../_params/params";
import { GameState } from "./state";
import { addToTimeline } from "./timeline";

export type Virus = {
  prob: number;
  turnEvent: { [turn: number]: number };
  turnsRequiredForHeal: number;
  turnsRequiredForDead: number;
  turnsRequiredForReinfect: number;
  TURNS_JUDGE_HEAL: number;
  TURNS_JUDGE_DEAD: number;
  HEAL_PROB: number;
  DEAD_PROB: number;
};

const virusEvents = (
  currentVirus: Virus,
  turns: number,
  params: ParamsModel,
  timeline: string
): { newVirus: Virus; timeline: string } => {
  const virus = { ...currentVirus };
  const events: { [num: number]: Function } = {
    0: enhanceProb,
    1: cureSlower,
  };

  if (Object.keys(virus.turnEvent).includes(turns.toString())) {
    const eventNum = virus.turnEvent[turns];
    return events[eventNum](virus, params, timeline, turns);
  }
  return { newVirus: virus, timeline: timeline };
};

const enhanceProb = (
  virus: Virus,
  params: ParamsModel,
  timeline: string,
  turns: number
) => {
  virus.prob *= params.PROB_POWER;
  const newTimeline = addToTimeline(
    timeline,
    turns,
    `ウイルスが強化！感染力が${virus.prob}になりました。`
  );
  return { newVirus: virus, timeline: newTimeline };
};

const cureSlower = (
  virus: Virus,
  params: ParamsModel,
  timeline: string,
  turns: number
) => {
  virus.turnsRequiredForHeal += params.CURE_SLOWER_EFFECT;
  const newTimeline = addToTimeline(
    timeline,
    turns,
    `ウイルスが強化！回復までの最短ターン数が${virus.turnsRequiredForHeal}になりました。`
  );
  return { newVirus: virus, timeline: newTimeline };
};

export const updateVirus = (
  virus: Virus,
  turns: number,
  params: ParamsModel,
  currentTimeline: string
): { virus: Virus; timeline: string } => {
  const { newVirus, timeline } = virusEvents(
    virus,
    turns,
    params,
    currentTimeline
  );
  return { virus: newVirus, timeline: timeline };
};
