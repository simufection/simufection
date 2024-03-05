import { ParamsModel } from "../_params/params";

export type Virus = {
  prob: number;
  turnEvent: { [turn: number]: number };
  turnsRequiredForHeal: number;
  turnsRequiredForDead: number;
  turnsRequiredForReinfect: number;
  T_Heal: number;
  T_Dead: number;
  HEAL_PROB: number;
  DEAD_PROB: number;
};

const virusEvents = (
  currentVirus: Virus,
  turn: number,
  params: ParamsModel
): Virus => {
  const virus = { ...currentVirus };
  const events: { [num: number]: Function } = {
    0: enhanceProb,
    1: cureSlower,
  };

  if (Object.keys(virus.turnEvent).includes(turn.toString())) {
    const eventNum = virus.turnEvent[turn];
    return events[eventNum](virus, params);
  }
  return virus;
};

const enhanceProb = (virus: Virus, params: ParamsModel) => {
  virus.prob *= params.PROB_POWER;
  return virus;
};

const cureSlower = (virus: Virus, params: ParamsModel) => {
  virus.turnsRequiredForHeal += params.CURE_SLOWER_EFFECT;
  return virus;
};

export const updateVirus = (
  virus: Virus,
  turn: number,
  params: ParamsModel
): Virus => {
  const newVirus = virusEvents(virus, turn, params);
  return newVirus;
};
