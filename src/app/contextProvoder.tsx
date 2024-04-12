"use client";
import useGameControl, { GameControl } from "@/hooks/game/useGameControl";
import { ReactNode, createContext } from "react";
import useGameSize, { GameSize } from "@/hooks/game/useGameSize";
import useCanvas, { CanvasData } from "@/hooks/game/useCanvas";

export const GameStateContext = createContext<GameControl | undefined>(
  undefined
);

export const GameSizeContext = createContext<GameSize | undefined>(undefined);

export const CanvasContext = createContext<CanvasData | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GameStateContext.Provider value={useGameControl()}>
      <GameSizeContext.Provider value={useGameSize()}>
        <CanvasContext.Provider value={useCanvas()}>
          {children}
        </CanvasContext.Provider>
      </GameSizeContext.Provider>
    </GameStateContext.Provider>
  );
};
