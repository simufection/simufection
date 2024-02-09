import { EFFECT_PARAMS } from "../_params/policyParams";

export type Virus = {
  prob: number;
  turnEvent: { [turn: number]: number };
  probPower: number;
  turnsRequiredForHeal: number;
};

const virusEvents = (currentVirus: Virus, turn: number): Virus => {
  const virus = { ...currentVirus };
  const events: { [num: number]: Function } = { 0: enhanceProb, 1: cureSlower };

  if (Object.keys(virus.turnEvent).includes(turn.toString())) {
    const eventNum = virus.turnEvent[turn];
    return events[eventNum](virus);
  }
  return virus;
};

const enhanceProb = (virus: Virus) => {
  virus.prob *= virus.probPower;
  return virus;
};

const cureSlower = (virus: Virus) => {
  virus.turnsRequiredForHeal += EFFECT_PARAMS.CURE_SLOWER_EFFECT;
  return virus;
};

export const updateVirus = (virus: Virus, turn: number): Virus => {
  const newVirus = virusEvents(virus, turn);
  return newVirus;
};
