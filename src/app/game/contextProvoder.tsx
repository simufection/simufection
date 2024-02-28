"use client";
import useGameControl, { GameControl } from "@/hooks/game/useGameControl";
import { ReactNode, createContext } from "react";

export const GameStateContext = createContext<GameControl | undefined>(
  undefined
);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GameStateContext.Provider value={useGameControl()}>
      {children}
    </GameStateContext.Provider>
  );
};
