import { ParamsModel } from "../../_types/Models";
import { COLORS } from "../../_params/colors";
import { GameState } from "../../_states/state";
import { drawBar } from "../../_states/bars";
import { DrawRatio } from "../../_params/drawRatio";

export const draw = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  params: ParamsModel
) => {
  const { sceneState, player, balls, bars, virus, rNote } = gameState;
  const { contactedCount, infectedCount, healedCount, turns, results } =
    sceneState;
  const drawRatio = DrawRatio(params);
  const render = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(
      0,
      0,
      params.MAX_WIDTH,
      params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT
    );

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(params.MAX_WIDTH, 0);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, params.MAX_HEIGHT);
    ctx.strokeStyle = "black";
    ctx.stroke();

    if (bars.length > params.DEFAULT_BARS) {
      for (let i = params.DEFAULT_BARS; i < bars.length; i++) {
        drawBar(bars[i], ctx);
      }
    }

    const ballNum = balls.length;
    for (let i = 0; i < ballNum; i++) {
      ctx.beginPath();
      ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2);
      ctx.fillStyle = balls[i].forecolor;
      ctx.fill();
      ctx.closePath();
    }

    if (turns > 0 && results.length > 0) {
      let drawWidth = 0;
      for (let i = 0; i < 5; i++) {
        if (params.MAX_WIDTH * i >= turns) {
          drawWidth = i;
          break;
        }
      }

      let preX = 0;
      let preInfected = 0;
      let preHealed = 0;
      const yInfected = params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT;
      const yHealed = params.MAX_HEIGHT + params.RADIUS;

      for (const data of results) {
        const x = Math.floor(data[0] / drawWidth);

        ctx.strokeStyle = COLORS.RED;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yInfected);
        ctx.lineTo(x, yInfected - data[2] * drawRatio.HEIGHT);
        ctx.stroke();

        const incrementalX = x - preX;
        if (incrementalX > 0) {
          for (let i = preX; i < x; i++) {
            ctx.beginPath();
            ctx.moveTo(i, yInfected);
            ctx.lineTo(i, yInfected - preInfected * drawRatio.HEIGHT);
            ctx.stroke();
          }
        }
        preInfected = data[2];

        if (data[3] > 0) {
          ctx.strokeStyle = COLORS.GREEN;
          ctx.beginPath();
          ctx.moveTo(x, yHealed);
          ctx.lineTo(x, yHealed + data[3] * drawRatio.HEIGHT);
          ctx.stroke();

          const incrementalX = x - preX;
          if (incrementalX > 0) {
            for (let i = preX; i < x; i++) {
              ctx.beginPath();
              ctx.moveTo(i, yHealed);
              ctx.lineTo(i, yHealed + preHealed * drawRatio.HEIGHT);
              ctx.stroke();
            }
          }
        }
        preX = x;
        preHealed = data[3];
      }
    }

    ctx.font = "12px Arial";
    ctx.fillStyle = COLORS.BLACK;

    let posY = 10;

    ctx.fillText("turn = " + turns, 0, params.MAX_HEIGHT + posY);
    posY += 20;
    ctx.fillText(
      "TURNS_REQUIRED_FOR_HEAL = " + virus.turnsRequiredForHeal,
      0,
      params.MAX_HEIGHT + posY
    );
    posY += 20;
    ctx.fillText(
      "contacted = " + contactedCount + "/" + ballNum,
      0,
      params.MAX_HEIGHT + posY
    );
    posY += 20;
    ctx.fillText(
      "healed = " + healedCount + "/" + ballNum + "(GREEN)",
      0,
      params.MAX_HEIGHT + posY
    );
    posY += 20;
    ctx.fillText(
      "infected = " + infectedCount + "/" + ballNum + "(RED)",
      0,
      params.MAX_HEIGHT + posY
    );
    posY += 20;
    ctx.fillText(
      "Basic reproduction number(R0(max)) = " +
        Math.round(rNote.valueMax * 100) / 100.0 +
        " (turn ... " +
        rNote.valueMaxTurnBegin +
        " to " +
        rNote.valueMaxTurnEnd +
        ")",
      0,
      params.MAX_HEIGHT + posY
    );
    posY += 20;
    ctx.fillText("points = " + player.points, 0, params.MAX_HEIGHT + posY);
    posY += 20;

    ctx.fillText("probability = " + virus.prob, 0, params.MAX_HEIGHT + posY);
    posY += 20;

    ctx.fillText(
      "turns required for heal = " + virus.turnsRequiredForHeal,
      0,
      params.MAX_HEIGHT + posY
    );
    posY += 20;

    if (contactedCount === params.MAX_BALLS) {
      const text1 =
        "infected incremental(BLUE)(ratio ... x" +
        drawRatio.INFECTED_INCREMENTAL +
        ")";
      const text2 = "end ... All balls are infected.";

      ctx.fillStyle = COLORS.BLACK;
      ctx.font = "14px Arial";

      ctx.fillText(text1, 0, params.MAX_HEIGHT + posY);
      posY += 20;

      ctx.fillText(text2, 0, params.MAX_HEIGHT + posY);
      posY += 20;
    }

    if (infectedCount === 0) {
      const text1 =
        "infected incremental(BLUE)(ratio ... x" +
        drawRatio.INFECTED_INCREMENTAL +
        ")";
      const text2 = "end ... The infected balls are gone.";

      ctx.fillStyle = COLORS.BLACK;
      ctx.font = "14px Arial";

      ctx.fillText(text1, 0, params.MAX_HEIGHT + 170);
      posY += 20;

      ctx.fillText(text2, 0, params.MAX_HEIGHT + 210);
      posY += 20;
    }

    drawScaleLine(ctx, params);
  };

  return {
    render: render,
  };
};

const drawScaleLine = (ctx: CanvasRenderingContext2D, params: ParamsModel) => {
  ctx.strokeStyle = "rgb(128, 128, 128)";
  ctx.lineWidth = 1;

  for (let x = 100; x < params.MAX_WIDTH; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, params.MAX_HEIGHT + params.RADIUS);
    ctx.lineTo(x, params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT);
    ctx.stroke();
  }

  for (
    let y = params.MAX_HEIGHT + params.RADIUS;
    y < params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT;
    y += 100
  ) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(params.MAX_WIDTH, y);
    ctx.stroke();
  }
};

export const drawResult = (
  ctx: CanvasRenderingContext2D,
  results: number[][],
  params: ParamsModel
) => {
  const drawRatio = DrawRatio(params);
  let pre_x = 0;
  let pre_data = 0;

  for (const data of results) {
    const x = Math.floor(data[0] / drawRatio.WIDTH);
    const y = params.MAX_HEIGHT + params.CHART_HEIGHT + params.RADIUS;
    const incremental_data = data[1] - pre_data;
    const incremental_x = x - pre_x;

    if (incremental_x > 0) {
      ctx.beginPath();
      ctx.strokeStyle = COLORS.BLUE;
      ctx.lineWidth = 1;
      ctx.moveTo(x, y);
      ctx.lineTo(
        x,
        y -
          Math.floor(
            (incremental_data / incremental_x) * drawRatio.INFECTED_INCREMENTAL
          )
      );
      ctx.stroke();
      ctx.closePath();
    }

    pre_x = x;
    pre_data = data[1];
  }

  drawScaleLine(ctx, params);
};

export const drawWhite = (
  ctx: CanvasRenderingContext2D,
  params: ParamsModel
) => {
  ctx.fillStyle = "white";
  ctx.fillRect(
    0,
    0,
    params.MAX_WIDTH,
    params.MAX_HEIGHT + params.RADIUS + params.CHART_HEIGHT
  );
};
