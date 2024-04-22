import { ParamsModel } from "@/app/_params/params";
import { getRandomInt } from "@/services/random";

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
    2: enhanceDeadProb,
  };

  if (Object.keys(virus.turnEvent).includes(turns.toString())) {
    const eventNum = virus.turnEvent[turns];
    return events[eventNum](virus, params, turns);
  }
  return { newVirus: virus, event: null };
};

export const enhanceProb = (
  virus: Virus,
  params: ParamsModel,
  turns: number
) => {
  virus.prob = Math.min(virus.prob * params.PROB_POWER, 1);
  const event = [turns, "virus_e", { prob: virus.prob.toFixed(2) }];
  return { newVirus: virus, event: event };
};

export const cureSlower = (
  virus: Virus,
  params: ParamsModel,
  turns: number
) => {
  virus.turnsRequiredForHeal += params.CURE_SLOWER_EFFECT;
  const event = [
    turns,
    "virus_c",
    { turnsRequiredForHeal: virus.turnsRequiredForHeal },
  ];
  return { newVirus: virus, event: event };
};

export const enhanceDeadProb = (
  virus: Virus,
  params: ParamsModel,
  turns: number
) => {
  virus.deadProb = Math.min(virus.deadProb * params.DEAD_PROB_RATE, 1);
  const event = [turns, "virus_d", { prob: virus.deadProb.toFixed(2) }];
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

export const initializeVirus = (
  mapName: string,
  params: ParamsModel
): Virus => {
  let turnEvent: { [turn: number]: number } = {};
  if (mapName != "tutorial") {
    for (let i = 1; params.VIRUS_EVENT_INTERVAL * i < 10000; i++) {
      turnEvent[params.VIRUS_EVENT_INTERVAL * i] = getRandomInt(0, 3);
    }
  }

  return {
    prob: params.VIRUS_INITIAL_PROB,
    turnEvent: turnEvent,
    turnsRequiredForHeal: params.TURNS_REQUIRED_FOR_HEAL,
    turnsRequiredForDead: params.TURNS_REQUIRED_FOR_DEAD,
    turnsRequiredForReinfect: params.TURNS_REQUIRED_FOR_REINFECT,
    turnsJudgeHeal: params.TURNS_JUDGE_HEAL,
    turnsJudgeDead: params.TURNS_JUDGE_DEAD,
    healProb: params.HEAL_PROB,
    deadProb: params.DEAD_PROB,
  };
};
