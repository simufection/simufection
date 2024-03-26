import { GameState } from "./state";

export const addToTimeline = (
  timeline: string,
  turns: number,
  text: string
) => {
  return `${turns}: ${text}
${timeline}`;
};
