import { StaticImageData } from "next/image";
import { ParamsModel } from "../../_params/params";
import { GameState, Objects, PlayingState } from "../../_states/state";
import { createBarInit } from "./createBar";
import { createFenceInit } from "./createFence";
import { cureFaster } from "./cureFaster";
import { vaccine } from "./vaccine";
import{mask} from "./mask";
import { lockdown } from "./lockdown";
import vaccineImage from "@/assets/img/vaccine.png";
import medicineImage from "@/assets/img/medicine.png";
import maskImage from "@/assets/img/mask.png";
import lockDownImage from "@/assets/img/lockDown.png";
import { Map } from "../../_states/maps";
import { kantoMapData } from "../../_maps/kanto/kantoMapData";

export type Policy = {
  key: string;
  label?: string;
  func: (
    state: GameState,
    params: ParamsModel,
    cvsPos: Position,
    mousePos: Position,
    sw: number
  ) => Object;
  point: string;
  isActive: boolean;
  image?: StaticImageData;
};

const mapPos = (
  cvsPos: Position,
  mousePos: Position,
  map: Map,
  params: ParamsModel,
  sw: number
) => {
  const ratio = sw / params.MAX_WIDTH;

  const [diffX, diffY] = [mousePos.x - cvsPos.x, mousePos.y - cvsPos.y];
  if (
    diffX < 0 ||
    diffY < 0 ||
    diffX > params.MAX_WIDTH ||
    diffY > params.MAX_HEIGHT
  ) {
    return false;
  }
  const [mapWidth, mapLength] = [map.map.length, map.map[0].length];
  const [x, y] = [
    Math.floor((diffX * mapWidth) / (ratio * params.MAX_WIDTH)),
    Math.floor((diffY * mapLength) / (ratio * params.MAX_HEIGHT)),
  ];

  return { x: x, y: y };
};

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
    func: (state, params, cvsPos, mousePos, sw) => {
      const { player } = state;
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      player.points -= params.POINTS_FOR_VACCINE;
      const virus = vaccine(state, params);
      return { player: player, virus: virus };
    },
    point: "POINTS_FOR_VACCINE",
    isActive: true,
    image: vaccineImage,
  },
  {
    key: "m",
    label: "mask",
    func: (state, params, cvsPos, mousePos,sw) => {
      const { player } = state;
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      player.points -= params.POINTS_FOR_MASK;
      const balls = mask(state, params);
      return { balls: balls };
    },
    point: "POINTS_FOR_MASK",
    isActive: true,
    image: maskImage,
  },
  {
    key: "c",
    label: "cure faster",
    func: (state, params, cvsPos, mousePos, sw) => {
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      const { player } = state;
      player.points -= params.POINTS_FOR_CURE_FASTER;
      const virus = cureFaster(state, params);
      return { player: player, virus: virus };
    },
    point: "POINTS_FOR_CURE_FASTER",
    isActive: true,
    image: medicineImage,
  },
  {
    key: "l",
    label: "lockdown",
    func: (state, params, cvsPos, mousePos, sw) => {
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      const { player, prefs, map } = state;
      if (!droppedPos) return {};
      const prefId = map.map[droppedPos.x][droppedPos.y];
      if (prefId <= 0 || prefs[prefId].isLockedDown) {
        return {};
      }
      player.points -= params.POINTS_FOR_LOCKDOWN;
      const { newPrefs } = lockdown(
        state,
        params,
        prefId,
        state.sceneState.turns
      );
      return { player: player, prefs: newPrefs };
    },
    point: "POINTS_FOR_LOCKDOWN",
    isActive: true,
    image: lockDownImage,
  },
];
