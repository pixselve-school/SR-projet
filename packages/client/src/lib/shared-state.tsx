// SharedStateContext.js
import { type GameMap } from '@viper-vortex/shared';
import { createContext, useContext, useState } from "react";
import { type Socket } from 'socket.io-client';

type SharedState = {
  scene?: GameMap;
  isConnected?: boolean;
  socket?: Socket;
}
type Context = {
  sharedState: SharedState,
  updateState: (newState: Partial<SharedState>) => void
}

const SharedStateContext = createContext<Context>({} as Context);

export function useSharedState() {
  return useContext(SharedStateContext);
}

export function SharedStateProvider({ children }: { children?: React.ReactNode }) {
  const [sharedState, setSharedState] = useState<SharedState>({
    scene: undefined,
    isConnected: false,
    socket: undefined,
  });

  const updateSharedState = (newState: Partial<SharedState>) => {
    setSharedState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <SharedStateContext.Provider value={{ sharedState, updateState: updateSharedState }}>
      {children}
    </SharedStateContext.Provider>
  );
}
