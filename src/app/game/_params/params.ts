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
  DEFAULT_BARS: 4,
  TURNS_REQUIRED_FOR_POINT: 50,
  FENCE_WIDTH: 150,
  FENCE_HEIGHT: 150,
  LEVY_SCALE: 4,
  LEVY_MAX: 50,
  MAX_POINTS: 10,
  VIRUS_INITIAL_PROB: 0.1,
  HEAL_INITIAL_PROB: 0.2,
  REINFECT_PROB: 0.1,
  BORDER_RATE: 0.5,
  OPTION_REFLECTION: 1,
  DEAD_PROB: 0.3,
  TURNS_REQUIRED_FOR_DEAD: 50,
  POINTS_FOR_LOCKDOWN: 5,
  TURNS_LOCKDOWN_PERSISTS: 300,
  LOCKDOWN_COMPLIANCE: 1,
  LOCKDOWN_COMPLIANCE_RATE: 0.5,
  COLOR_LOCKDOWN: COLORS.SHELL_PINK,
};
