import { StaticImageData } from "next/image";
import { ParamsModel } from "../../_params/params";
import { GameState, Objects, PlayingState } from "../../_states/state";
import { createBarInit } from "./createBar";
import { createFenceInit } from "./createFence";
import { cureFaster } from "./cureFaster";
import { vaccine } from "./vaccine";
import { pcr } from "./pcr";
import { mask } from "./mask";
import { medicine } from "./medicine";
import { lockdown } from "./lockdown";
import vaccineImage from "@/assets/img/vaccine.png";
import medicineImage from "@/assets/img/medicine.png";
import maskImage from "@/assets/img/mask.png";
import lockDownImage from "@/assets/img/lockDown.png";
import pcrImage from "@/assets/img/pcr.png";
import { Map } from "../../_states/maps";
import { kantoMapData } from "../../_maps/kanto/kantoMapData";
import { allPrefs } from "../../_data/prefs";
import { addToTimeline } from "../../_states/timeline";

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
      const timeline = addToTimeline(
        state.timeline,
        state.sceneState.turns,
        `ワクチン接種を実施！ウイルスの感染力が${virus.prob.toFixed(
          2
        )}になりました！`
      );
      return { player: player, virus: virus, timeline: timeline };
    },
    point: "POINTS_FOR_VACCINE",
    isActive: true,
    image: vaccineImage,
  },
  {
    key: "e",
    label: "medicine",
    func: (state, params, cvsPos, mousePos, sw) => {
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      const { player } = state;
      player.points -= params.POINTS_FOR_MEDICINE;
      const virus = medicine(state, params);
      const timeline = addToTimeline(
        state.timeline,
        state.sceneState.turns,
        `抗菌薬の普及！回復までの最短ターン数が${virus.turnsRequiredForHeal}になりました！`
      );
      return { player: player, virus: virus, timeline: timeline };
    },
    point: "POINTS_FOR_MEDICINE",
    isActive: true,
    image: medicineImage,
  },
  {
    key: "m",
    label: "mask",
    func: (state, params, cvsPos, mousePos, sw) => {
      const { player } = state;
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      player.points -= params.POINTS_FOR_MASK;
      const { balls, data } = mask(state, params);
      const timeline = addToTimeline(
        state.timeline,
        state.sceneState.turns,
        `マスク配布！感染者${data.all}人のうち${data.num}人がマスクをつけ、他人に感染させなくなりました！`
      );
      return { balls: balls, timeline: timeline };
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
    isActive: false,
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
      const timeline = addToTimeline(
        state.timeline,
        state.sceneState.turns,
        `ロックダウン！${
          allPrefs.filter((row) => row.id == prefId)[0].name
        }がロックダウンされました！`
      );
      return { player: player, prefs: newPrefs, timeline: timeline };
    },
    point: "POINTS_FOR_LOCKDOWN",
    isActive: true,
    image: lockDownImage,
  },
  {
    key: "p",
    label: "pcr",
    func: (state, params, cvsPos, mousePos, sw) => {
      const { player } = state;
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      player.points -= params.POINTS_FOR_PCR;
      const { balls, data } = pcr(state, params);
      const timeline = addToTimeline(
        state.timeline,
        state.sceneState.turns,
        `PCR検査を実施！${data.all}人が検査され、${data.positive}人が陽性となり自宅謹慎することになりました。`
      );
      return { player: player, balls: balls, timeline: timeline };
    },
    point: "POINTS_FOR_PCR",
    isActive: true,
    image: pcrImage,
  },
];
