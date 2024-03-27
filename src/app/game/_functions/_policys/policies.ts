import { StaticImageData } from "next/image";
import { ParamsModel } from "../../_params/params";
import { GameState, Objects, PlayingState } from "../../_states/state";
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
import { allPrefs } from "../../_data/prefs";

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
  cooltime?: number;
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
    key: "v",
    label: "vaccinate",
    func: (state, params, cvsPos, mousePos, sw) => {
      const { player } = state;
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      player.points -= params.POINTS_FOR_VACCINE;
      const virus = vaccine(state, params);
      const events = [...state.events];
      events.push([
        state.sceneState.turns,
        "policy_v",
        { prob: virus.prob.toFixed(2) },
      ]);
      return { player: player, virus: virus, events: events };
    },
    point: "POINTS_FOR_VACCINE",
    isActive: true,
    image: vaccineImage,
    cooltime: 100,
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
      const events = [...state.events];
      events.push([
        state.sceneState.turns,
        "policy_e",
        {
          healProb: virus.healProb,
        },
      ]);
      return { player: player, virus: virus, events: events };
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
      const events = [...state.events];
      events.push([state.sceneState.turns, "policy_m", { ...data }]);
      return { balls: balls, events: events };
    },
    point: "POINTS_FOR_MASK",
    isActive: true,
    image: maskImage,
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
      const events = [...state.events];
      events.push([
        state.sceneState.turns,
        "policy_l",
        {
          name: allPrefs.filter((row) => row.id == prefId)[0].name,
          compliance: prefs[prefId].lockdownCompliance,
        },
      ]);
      return { player: player, prefs: newPrefs, events: events };
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
      const events = [...state.events];
      events.push([state.sceneState.turns, "policy_p", { ...data }]);
      return { player: player, balls: balls, events: events };
    },
    point: "POINTS_FOR_PCR",
    isActive: true,
    image: pcrImage,
  },
];
