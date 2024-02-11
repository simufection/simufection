"use client";
import useGameControl from "@/hooks/game/useGameControl";
import { ReactNode, createContext } from "react";

export const GameStateContext = createContext<any | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GameStateContext.Provider value={useGameControl()}>
      {children}
    </GameStateContext.Provider>
  );
};
