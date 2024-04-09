import { StaticImageData } from "next/image";
import { ParamsModel } from "../../_params/params";
import { GameState, Objects, PlayingState } from "../../_states/state";
import { vaccine } from "./vaccine";
import { mask } from "./mask";
import { disposable_mask } from "./disposable_mask";
import { pcr } from "./pcr";
import { medicine } from "./medicine";
import { lockdown } from "./lockdown";
import { infectionRate } from "../../_states/balls";
import vaccineImage from "@/assets/img/vaccine.png";
import medicineImage from "@/assets/img/medicine.png";
import maskImage from "@/assets/img/mask.png";
import disposableMaskImage from "@/assets/img/disposable_mask.png";
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
  initPoint: number;
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

export const policies = (params: ParamsModel): Policy[] => {
  return [
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
      initPoint: params["POINTS_FOR_VACCINE"],
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
            healProb: virus.healProb.toFixed(2),
          },
        ]);
        return { player: player, virus: virus, events: events };
      },
      initPoint: params["POINTS_FOR_MEDICINE"],
      isActive: true,
      image: medicineImage,
    },

    point: "POINTS_FOR_MEDICINE",
    isActive: true,
    image: medicineImage,
  },
  {
    key: "d",
    label: "disposable_mask",
    func: (state, params, cvsPos, mousePos, sw) => {
      const { player } = state;
      const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
      if (!droppedPos) return {};
      player.points -= params.POINTS_FOR_DISPOSABLE_MASK;
      const { balls, data } = disposable_mask(state, params);
      const events = [...state.events];
      events.push([state.sceneState.turns, "policy_d", { ...data }]);
      return { balls: balls, events: events };
    },
    point: "POINTS_FOR_DISPOSABLE_MASK",
    isActive: true,
    image: disposableMaskImage,
    cooltime: 500,
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
      initPoint: params["POINTS_FOR_MASK"],
      isActive: true,
      image: maskImage,
    },
    {
      key: "l",
      label: "lockdown",
      func: (state, params, cvsPos, mousePos, sw) => {
        const droppedPos = mapPos(cvsPos, mousePos, state.map, params, sw);
        const { player, prefs, map, balls } = state;
        if (!droppedPos) return {};
        const prefId = map.map[droppedPos.x][droppedPos.y];
        if (prefId <= 0 || prefs[prefId].isLockedDown) {
          return {};
        }
        if (infectionRate(balls, prefId) < params.INFECTION_RATE_FOR_LOCKDOWN) {
          const events = [...state.events];
          events.push([
            state.sceneState.turns,
            "lockdown_failure",
            {
              name: allPrefs.filter((row) => row.id == prefId)[0].name,
            },
          ]);
          return { events: events };
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
            compliance: (1 - prefs[prefId].lockdownCompliance).toFixed(2),
          },
        ]);
        return { player: player, prefs: newPrefs, events: events };
      },
      initPoint: params["POINTS_FOR_LOCKDOWN"],
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
      initPoint: params["POINTS_FOR_PCR"],
      isActive: true,
      image: pcrImage,
    },
  ];
};
