import { COLORS } from "./colors";

export interface ParamsModel {
  [name: string]: any;
}

export const Params: ParamsModel = {
  MAX_WIDTH: 640,
  MAX_HEIGHT: 480,
  MAX_BALLS: 1000,
  RADIUS: 1,
  RATIO_OF_BALLS_STOPPED: 0.0,
  COLOR_INFECTED: COLORS.RED,
  COLOR_UNINFECTED: COLORS.BLUE,
  COLOR_RECOVERED: COLORS.GREEN,
  COLOR_DEAD: COLORS.GRAY,
  SLEEP_SEC: 1 / 30,
  CHART_HEIGHT: 50,
  BAR_WIDTH: 6,
  BAR_LENGTH: 200,
  TURNS_REQUIRED_FOR_HEAL: 200,
  TURNS_REQUIRED_FOR_REINFECT: 200,
  TURNS_JUDGE_HEAL: 50,
  TURNS_JUDGE_DEAD: 50,
  DEFAULT_BARS: 4,
  TURNS_REQUIRED_FOR_POINT: 50,
  INITIAL_DELTA_POINT: 0.004,
  MAX_DELTA_POINT: 0.1,
  FENCE_WIDTH: 150,
  FENCE_HEIGHT: 150,
  LEVY_SCALE: 4,
  LEVY_MAX: 50,
  MAX_POINTS: 10,
  VIRUS_INITIAL_PROB: 0.1,
  HEAL_PROB: 0.1,
  MEDICINE_EFFECT: 1.1,
  POINTS_FOR_MEDICINE: 5,
  REINFECT_PROB: 0.1,
  BORDER_RATE: 0.5,
  DEAD_PROB: 0.1,
  TURNS_REQUIRED_FOR_DEAD: 250,
  POINTS_FOR_LOCKDOWN: 5,
  INFECTION_RATE_FOR_LOCKDOWN: 0.3,
  INFECTION_RATE_LOCKDOWN_ENDS: 0.2,
  INFECTION_PROB_RATE_LOCKDOWN: 0.6,
  SPEED_UNDER_LOCKDOWN: 0.6,
  LOCKDOWN_COMPLIANCE: 1,
  LOCKDOWN_COMPLIANCE_RATE: 0.5,
  COLOR_LOCKDOWN: COLORS.SHELL_PINK,
  MASK_DURATION: 150,
  POSITIVE_RATE: 90,
  FALSE_POSITIVE_RATE: 10,
  TURNS_REQUIRED_FOR_RE_MOVE: 150,
  CHECK_INFECTED: 50,
  MASK_PROB: 0.8,
};
