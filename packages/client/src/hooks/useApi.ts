import { useSharedState } from "@/lib/shared-state";
import {
  SOCKET_EVENTS,
  type SceneDTO,
  type PlayerMoveDTO,
  ScoresDTO,
  decode,
  AddOrbView,
  OrbDTO,
  colors,
  RemoveOrbView,
} from "@viper-vortex/shared";
import { useCallback, useEffect } from "react";
import { io } from "socket.io-client";
import { Game } from "@/lib/Game";

export function useApi(game?: Game) {
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

    function handleOrbs(orbsToAddBuffer: ArrayBuffer) {
      if (!game) return;
      const orbsToAdd = decode(orbsToAddBuffer, AddOrbView);
      console.log(orbsToAdd);
      game.addOrbs(
        orbsToAdd.map((orb) => ({
          id: orb.id,
          points: orb.points,
          color: colors[orb.color] as string,
          position: {
            x: orb.x,
            y: orb.y,
          },
        })),
      );
    }

    function handleRemoveOrbs(orbsToRemoveBuffer: ArrayBuffer) {
      if (!game) return;
      const orbsToRemove = decode(orbsToRemoveBuffer, RemoveOrbView);
      game.removeOrb(orbsToRemove.id);
    }

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);
    socket?.on(SOCKET_EVENTS.FRAME, handleFrame);
    socket?.on(SOCKET_EVENTS.SCORES, handleScores);
    socket?.on(SOCKET_EVENTS.ADD_ORB, handleOrbs);
    socket?.on(SOCKET_EVENTS.REMOVE_ORB, handleRemoveOrbs);
    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off(SOCKET_EVENTS.FRAME, handleFrame);
      socket?.off(SOCKET_EVENTS.SCORES, handleScores);
      socket?.off(SOCKET_EVENTS.ORBS, handleOrbs);
      socket?.off(SOCKET_EVENTS.REMOVE_ORB, handleRemoveOrbs);
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
