import { ParamsModel } from "../_params/params";

export type Virus = {
  prob: number;
  turnEvent: { [turn: number]: number };
  turnsRequiredForHeal: number;
  turnsRequiredForDead: number;
  turnsRequiredForReinfect: number;
  turnsJudgeHeal: number;
  turnsJudgeDead: number;
  healProb: number;
  deadProb: number;
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
    return events[eventNum](virus, params, turns);
  }
  return { newVirus: virus, event: null };
};

const enhanceProb = (virus: Virus, params: ParamsModel, turns: number) => {
  virus.prob = Math.min(virus.prob * params.PROB_POWER, 1);
  const event = [turns, "virus_e", { prob: virus.prob.toFixed(2) }];
  return { newVirus: virus, event: event };
};

const cureSlower = (virus: Virus, params: ParamsModel, turns: number) => {
  virus.turnsRequiredForHeal += params.CURE_SLOWER_EFFECT;
  const event = [
    turns,
    "virus_c",
    { turnsRequiredForHeal: virus.turnsRequiredForHeal },
  ];
  return { newVirus: virus, event: event };
};

export const updateVirus = (
  virus: Virus,
  turns: number,
  params: ParamsModel
) => {
  const virusEvents: [number, string, any][] = [];
  const { newVirus, event } = virusEvent(virus, turns, params);
  if (event) virusEvents.push(event);
  return { virus: newVirus, virusEvents: virusEvents };
};
