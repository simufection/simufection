import { StaticImageData } from "next/image";
import { ParamsModel } from "../../_params/params";
import { GameState, Objects, PlayingState } from "../../_states/state";
import { createBarInit } from "./createBar";
import { createFenceInit } from "./createFence";
import { cureFaster } from "./cureFaster";
import { vaccine } from "./vaccine";
import vaccineImage from "@/assets/img/vaccine.png";
import medicineImage from "@/assets/img/medicine.png";
import lockDownImage from "@/assets/img/lockDown.png";

export type Policy = {
  key: string;
  label?: string;
  func: (
    state: GameState,
    params: ParamsModel,
    cvsPos: Position,
    mousePos: Position
  ) => Object;
  point: string;
  isActive: boolean;
  image?: StaticImageData;
};

const include = (a: Position, b: Position, params: ParamsModel) =>
  a.x < b.x &&
  a.y < b.y &&
  a.x + params.MAX_WIDTH > b.x &&
  a.y + params.MAX_HEIGHT > b.y;

export const policies: Policy[] = [
  {
    key: "b",
    label: "create bar",
    func: (state, params, cvsPos, mousePos) => {
      createBarInit(state.bars, params);
      return { playingState: PlayingState.editing, editing: Objects.bar };
    },
    point: "POINTS_FOR_BAR",
    isActive: false,
  },
  {
    key: "f",
    label: "create fence",
    func: (state, params, cvsPos, mousePos) => {
      createFenceInit(state.fences, state.bars, params);
      return { playingState: PlayingState.editing, editing: Objects.fence };
    },
    point: "POINTS_FOR_FENCE",
    isActive: false,
  },
  {
    key: "v",
    label: "vaccinate",
    func: (state, params, cvsPos, mousePos) => {
      const { player } = state;
      if (!include(cvsPos, mousePos, params)) return {};
      player.points -= params.POINTS_FOR_VACCINE;
      const virus = vaccine(state, params);
      return { player: player, virus: virus };
    },
    point: "POINTS_FOR_VACCINE",
    isActive: true,
    image: vaccineImage,
  },
  {
    key: "c",
    label: "cure faster",
    func: (state, params, cvsPos, mousePos) => {
      if (!include(cvsPos, mousePos, params)) return {};
      const { player } = state;
      player.points -= params.POINTS_FOR_CURE_FASTER;
      const virus = cureFaster(state, params);
      return { player: player, virus: virus };
    },
    point: "POINTS_FOR_CURE_FASTER",
    isActive: true,
    image: medicineImage,
  },
];
