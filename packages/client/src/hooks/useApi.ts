import { useSharedState } from "@/lib/shared-state";
import {
  SOCKET_EVENTS,
  type SceneDTO,
  type PlayerMoveDTO,
  ScoresDTO,
} from "@viper-vortex/shared";
import { useCallback, useEffect } from "react";
import { io } from "socket.io-client";
import { packetToOrbs } from "@viper-vortex/shared/dist/protocol";

export function useApi() {
  const {
    sharedState: { isConnected, scene, socket, scores, orbs },
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

    function handleScores(scores: ScoresDTO) {
      updateState({ scores });
    }

    function handleOrbs(orbs: ArrayBuffer) {
      const orbsArray = packetToOrbs(orbs);
      updateState({
        orbs: orbsArray,
      });
    }

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);
    socket?.on(SOCKET_EVENTS.FRAME, handleFrame);
    socket?.on(SOCKET_EVENTS.SCORES, handleScores);
    socket?.on(SOCKET_EVENTS.ORBS, handleOrbs);
    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off(SOCKET_EVENTS.FRAME, handleFrame);
      socket?.off(SOCKET_EVENTS.SCORES, handleScores);
      socket?.off(SOCKET_EVENTS.ORBS, handleOrbs);
    };
  }, [updateState, socket]);

  return {
    connect,
    socket,
    disconnect,
    move,
    scene,
    isConnected,
    scores,
    orbs,
  };
}

export type Api = ReturnType<typeof useApi>;
