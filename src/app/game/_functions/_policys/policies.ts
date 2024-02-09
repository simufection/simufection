import { ParamsModel } from "../../_params/params";
import { POLICY_PARAMS } from "../../_params/policyParams";
import { GameState, Objects, PlayingState } from "../../_states/state";
import { createBarInit } from "./createBar";
import { createFenceInit } from "./createFence";
import { cureFaster } from "./cureFaster";
import { vaccine } from "./vaccine";

export type Policy = {
  key: string;
  label?: string;
  func: (state: GameState, params: ParamsModel) => Object;
  point: number;
  isActive: boolean;
};
export const policies: Policy[] = [
  {
    key: "b",
    label: "create bar",
    func: (state: GameState, params: ParamsModel) => {
      createBarInit(state.bars, params);
      return { playingState: PlayingState.editing, editing: Objects.bar };
    },
    point: POLICY_PARAMS.POINTS_FOR_BAR,
    isActive: false,
  },
  {
    key: "f",
    label: "create fence",
    func: (state: GameState, params: ParamsModel) => {
      createFenceInit(state.fences, state.bars, params);
      return { playingState: PlayingState.editing, editing: Objects.fence };
    },
    point: POLICY_PARAMS.POINTS_FOR_FENCE,
    isActive: false,
  },
  {
    key: "v",
    label: "vaccinate",
    func: (state: GameState, params: ParamsModel) => {
      const { player } = state;
      player.points -= POLICY_PARAMS.POINTS_FOR_VACCINE;
      const virus = vaccine(state);
      return { player: player, virus: virus };
    },
    point: POLICY_PARAMS.POINTS_FOR_VACCINE,
    isActive: true,
  },
  {
    key: "c",
    label: "cure faster",
    func: (state: GameState, params: ParamsModel) => {
      const { player } = state;
      player.points -= POLICY_PARAMS.POINTS_FOR_CURE_FASTER;
      const virus = cureFaster(state);
      return { player: player, virus: virus };
    },
    point: POLICY_PARAMS.POINTS_FOR_CURE_FASTER,
    isActive: true,
  },
];
