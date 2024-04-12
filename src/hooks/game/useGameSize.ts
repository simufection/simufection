import { ParamsModel } from "@/app/_params/params";
import { Dispatch, useCallback, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";

export type GameSize = {
  gameSize: [number, number];
  setGameSize: Dispatch<[number, number]>;
  ratio: number;
  calcGameSize: (params: ParamsModel) => void;
};

const useGameSize = (): GameSize => {
  const [gameSize, setGameSize] = useState<[number, number]>([0, 0]);
  const [w, h] = useWindowSize();
  const [ratio, setRatio] = useState(1);

  const calcGameSize = (params: ParamsModel) => {
    const canvasAspect = (params.MAX_HEIGHT + 50) / params.MAX_WIDTH;
    let screenWidth = 0;
    let screenHeight = 0;
    if (w * canvasAspect <= h) {
      screenWidth = Math.min(params.MAX_WIDTH, w);
      screenHeight = screenWidth * canvasAspect;
    } else {
      screenHeight = Math.min(params.MAX_HEIGHT, h);
      screenWidth = screenHeight / canvasAspect;
    }
    setRatio(screenWidth / params.MAX_WIDTH);
    setGameSize([screenWidth, screenHeight]);
  };

  return {
    gameSize,
    setGameSize,
    ratio,
    calcGameSize,
  };
};

export default useGameSize;
