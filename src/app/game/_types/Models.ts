export interface ParamsModel {
  [name: string]: any;
  setParams: (_: {}) => void;
}

export interface ColorsModel {
  [name: string]: string;
}

export interface DrawRatioModel {
  INFECTED_INCREMENTAL: number;
  WIDTH: number;
  HEIGHT: number;
}

export interface PlayerModel {
  points: number;
}

export interface VirusModel {
  prob: number;
  turnEvent: { [turn: number]: number };
  probPower: number;
  turnsRequiredForHeal: number;
}

export type MovementModel = FixedLengthArray<number, 3>;

export interface BarModel {
  isVertical: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color?: string;
}

export interface BallModel {
  forecolor: string;
  radius: number;
  x: number;
  y: number;
  addX: number;
  addY: number;
  contacted: boolean;
  healed: boolean;
  turnHeal: number;
}

export interface RNoteModel {
  resultsWIDTH: number;
  termTurn: number;
  termIncremental: number;
  value: number;
  valueMax: number;
  valueMaxTurnBegin: number;
  valueMaxTurnEnd: number;
}

export interface makeBarModel {
  newBar: BarModel;
  pressB: () => void;
  pressEnt: () => void;
  pressRight: () => void;
  pressLeft: () => void;
  pressUp: () => void;
  pressDown: () => void;
}

export interface KeyModel {
  id?: number;
  down: Set<string>;
  up: Set<string>;
  downAll: Set<string>;
}

export interface FenceModel {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color?: string;
  width: number;
  barIndex: number[];
}
