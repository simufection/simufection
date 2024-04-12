import { drawWhite } from "@/app/_functions/_drawing/draw";
import { ParamsModel } from "@/app/_params/params";
import { Dispatch, useState } from "react";

export type CanvasData = {
  ctx: CanvasRenderingContext2D | null;
  setContext: Dispatch<CanvasRenderingContext2D | null>;
  createCtx: (params: ParamsModel) => void;
};

const useCanvas = (): CanvasData => {
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const createCtx = (params: ParamsModel) => {
    const canvas = document.getElementById("screen") as HTMLCanvasElement;
    const canvasctx = canvas.getContext("2d");
    drawWhite(canvasctx!, params);
    setContext(canvasctx);
  };

  return {
    ctx,
    setContext,
    createCtx,
  };
};

export default useCanvas;
