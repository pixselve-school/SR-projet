import { useSharedState } from "@/lib/shared-state";
import {
  SOCKET_EVENTS,
  type SceneDTO,
  type PlayerMoveDTO,
} from "@viper-vortex/shared";
import { useCallback, useEffect } from "react";
import { io } from "socket.io-client";

export function useApi() {
  const {
    sharedState: { isConnected, scene, socket },
    updateState,
  } = useSharedState();

  const connect = useCallback(
    (serverUrl: string, username: string) => {
      if (socket) socket.disconnect();
      const newSocket = io(serverUrl, { autoConnect: true });
      newSocket.emit(SOCKET_EVENTS.JOIN, username);
      updateState({ socket: newSocket });
    },
    [socket, updateState],
  );

  const disconnect = useCallback(() => {
    socket?.disconnect();
    updateState({ socket: undefined });
  }, [socket, updateState]);

  const move = useCallback(
    (move: PlayerMoveDTO) => {
      socket?.emit(SOCKET_EVENTS.MOVE, move);
    },
    [socket],
  );

  useEffect(() => {
    function handleConnect() {
      updateState({ isConnected: true });
    }
    function handleDisconnect() {
      updateState({ isConnected: false });
    }
    function handleFrame(scene: SceneDTO) {
      updateState({ scene });
    }
    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);
    socket?.on(SOCKET_EVENTS.FRAME, handleFrame);
    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off(SOCKET_EVENTS.FRAME, handleFrame);
    };
  }, [updateState, socket]);

  return {
    connect,
    socket,
    disconnect,
    move,
    scene,
    isConnected,
  };
}

export type Api = ReturnType<typeof useApi>;
