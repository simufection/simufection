import { ParamsModel } from "../_params/params";

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

const virusEvent = (
  currentVirus: Virus,
  turns: number,
  params: ParamsModel
) => {
  const virus = { ...currentVirus };
  const events: { [num: number]: Function } = {
    0: enhanceProb,
    1: cureSlower,
  };

  if (Object.keys(virus.turnEvent).includes(turns.toString())) {
    const eventNum = virus.turnEvent[turns];
    return events[eventNum](virus, params);
  }
  return { newVirus: virus, event: null };
};

const enhanceProb = (virus: Virus, params: ParamsModel) => {
  virus.prob *= params.PROB_POWER;
  const event = `ウイルスが強化！感染力が${virus.prob.toFixed(
    2
  )}になりました。`;
  return { newVirus: virus, event: event };
};

const cureSlower = (virus: Virus, params: ParamsModel) => {
  virus.turnsRequiredForHeal += params.CURE_SLOWER_EFFECT;
  const event = `ウイルスが強化！回復までの最短ターン数が${virus.turnsRequiredForHeal}になりました。`;
  return { newVirus: virus, event: event };
};

export const updateVirus = (
  virus: Virus,
  turns: number,
  params: ParamsModel
) => {
  const virusEvents: string[] = [];
  const { newVirus, event } = virusEvent(virus, turns, params);
  if (event) virusEvents.push(event);
  return { virus: newVirus, virusEvents: virusEvents };
};
