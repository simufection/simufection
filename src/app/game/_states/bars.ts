import { COLORS } from "../_params/colors";
import { ParamsModel } from "../_params/params";
import { Ball } from "./balls";

export type Bar = {
  isVertical: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color?: string;
};

export const createBar = (
  isVertical: boolean,
  x: number,
  y: number,
  dx: number,
  dy: number,
  color: string = COLORS.BLACK
): Bar => {
  return {
    isVertical: isVertical,
    x: x,
    y: y,
    dx: dx,
    dy: dy,
    color: color,
  };
};

export const updateRotation = (bar: Bar, params: ParamsModel): Bar => {
  const newX = bar.x + Math.floor(bar.dx / 2) - Math.floor(bar.dy / 2);
  const newY = bar.y - Math.floor(bar.dx / 2) + Math.floor(bar.dy / 2);
  const newDx = bar.dy;
  const newDy = bar.dx;

  return {
    isVertical: !bar.isVertical,
    x: Math.min(Math.max(0, newX), params.MAX_WIDTH - newDx),
    y: Math.min(Math.max(0, newY), params.MAX_HEIGHT - newDy),
    dx: newDx,
    dy: newDy,
    color: bar.color,
  };
};

export const updatePosition = (
  bar: Bar,
  addX: number,
  addY: number,
  params: ParamsModel
) => {
  const newX = bar.x + addX;
  const newY = bar.y + addY;
  return {
    ...bar,
    ...{
      x: Math.min(Math.max(0, newX), params.MAX_WIDTH - bar.dx),
      y: Math.min(Math.max(0, newY), params.MAX_HEIGHT - bar.dy),
    },
  };
};

export const updateBalls = (
  bar: Bar,
  params: ParamsModel,
  currentBalls: Ball[]
): Ball[] => {
  const { x, y, dx, dy } = bar;
  const balls = [...currentBalls];

  const ballNum = balls.length;
  for (let i = 0; i < ballNum; i++) {
    if (!contains(bar, balls[i].x, balls[i].y)) {
      continue;
    }
    if (bar.isVertical) {
      if (balls[i].x < x + dx / 2) {
        balls[i].x = x;
      } else {
        balls[i].x = x + dx;
      }
    } else {
      if (balls[i].y < y + dy / 2) {
        balls[i].y = y;
      } else {
        balls[i].y = y + dy;
      }
    }
  }
  return balls;
};

export const closeToBars = (bars: Bar[], params: ParamsModel): boolean => {
  const isClose = (bar1: Bar, bar2: Bar): boolean => {
    if (bar1.isVertical === bar2.isVertical) {
      if (
        (bar1.isVertical && Math.abs(bar1.x - bar2.x) < params.BAR_WIDTH * 2) ||
        (!bar1.isVertical && Math.abs(bar1.y - bar2.y) < params.BAR_WIDTH * 2)
      ) {
        return true;
      }
    }
    return false;
  };

  for (let i = 0; i < bars.length - 1; i++) {
    for (let j = i + 1; j < bars.length; j++) {
      if (isClose(bars[i], bars[j])) return true;
    }
  }

  return false;
};

export const contains = (bar: Bar, _x: number, _y: number) => {
  return (
    bar.x <= _x && _x <= bar.x + bar.dx && bar.y <= _y && _y <= bar.y + bar.dy
  );
};

export const drawBar = (bar: Bar, ctx: CanvasRenderingContext2D) => {
  const { isVertical, x, y, dx, dy } = bar;
  ctx.strokeStyle = bar.color || COLORS.BLACK;
  ctx.lineWidth = isVertical ? dx : dy;

  if (isVertical) {
    ctx.beginPath();
    ctx.moveTo(x + dx / 2, y);
    ctx.lineTo(x + dx / 2, y + dy);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x, y + dy / 2);
    ctx.lineTo(x + dx, y + dy / 2);
    ctx.stroke();
  }
};

export const updateBars = (currentBars: Bar[]): Bar[] => {
  const bars = currentBars;

  return bars;
};
