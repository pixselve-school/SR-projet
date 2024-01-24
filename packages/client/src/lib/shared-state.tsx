"use client"
// SharedStateContext.js
import { type GameMap, type Player } from '@viper-vortex/shared';
import { createContext, useContext, useState } from "react";

type SharedState = {
  me?: Player;
  scene?: GameMap;
  isConnected?: boolean;
}
type Context = {
  sharedState: SharedState,
  updateSharedState: (newState: Partial<SharedState>) => void
}

const SharedStateContext = createContext<Context>({} as Context);

export function useSharedState() {
  return useContext(SharedStateContext);
}

export function SharedStateProvider({ children }: { children?: React.ReactNode }) {
  const [sharedState, setSharedState] = useState<SharedState>({
    me: undefined,
    scene: undefined,
    isConnected: false,
  });

  const updateSharedState = (newState: Partial<SharedState>) => {
    setSharedState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <SharedStateContext.Provider value={{ sharedState, updateSharedState }}>
      {children}
    </SharedStateContext.Provider>
  );
}
