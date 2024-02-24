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
import { Map } from "../../_states/maps";
import { kantoMapData } from "../../_maps/kanto/kantoMapData";

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

const mapPos = (
  cvsPos: Position,
  mousePos: Position,
  map: Map,
  params: ParamsModel
) => {
  if (
    cvsPos.x > mousePos.x ||
    cvsPos.y > mousePos.y ||
    cvsPos.x + params.MAX_WIDTH < mousePos.x ||
    cvsPos.y + params.MAX_HEIGHT < mousePos.y
  ) {
    return false;
  }
  const [mapWidth, mapLength] = [map.map.length, map.map[0].length];
  const [x, y] = [
    Math.floor((mousePos.x * mapWidth) / params.MAX_WIDTH),
    Math.floor((mousePos.y * mapLength) / params.MAX_HEIGHT),
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
    func: (state, params, cvsPos, mousePos) => {
      const { player } = state;
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params);
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
    key: "c",
    label: "cure faster",
    func: (state, params, cvsPos, mousePos) => {
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params);
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
    func: (state, params, cvsPos, mousePos) => {
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params);
      const { player, lockdown_prefs, map } = state;

      if (!droppedPos || map.map[droppedPos.x][droppedPos.y] <= 0) return {};
      player.points -= params.POINTS_FOR_LOCKDOWN;
      lockdown_prefs[map.map[droppedPos.x][droppedPos.y]] = true;
      return { player: player, lockdown_prefs };
    },
    point: "POINTS_FOR_LOCKDOWN",
    isActive: true,
    image: lockDownImage,
  },
];
