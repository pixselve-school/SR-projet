import { useSharedState } from '@/lib/shared-state';
import {
  SOCKET_EVENTS,
  type GameMap,
  type PlayerMove
} from "@viper-vortex/shared";
import { useEffect } from "react";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";
const socket = io(URL!, { autoConnect: false }); 

export function useApi() {
  const {sharedState: {isConnected, me, scene}, updateSharedState } = useSharedState();

  useEffect(() => {
    if (!scene) return;
    const newMe = scene.players.find((p) => p.id === socket.id);
    updateSharedState({me: newMe});
  }, [scene, updateSharedState]);

  useEffect(() => {
    function handleConnect() {
      updateSharedState({isConnected: true});
    }
    function handleDisconnect() {
      updateSharedState({isConnected: false});
    }
    function handleFrame(scene: GameMap) {
      updateSharedState({scene});
    }
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(SOCKET_EVENTS.FRAME, handleFrame);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(SOCKET_EVENTS.FRAME, handleFrame);
    };
  }, [updateSharedState]);

  return {
    connect: () => {
      socket.connect();
    },
    socket,
    onDisconnect: (fn: () => void) => {
      socket.on("disconnect", fn);
    },
    onConnect: (fn: () => void) => {
      socket.on("connect", fn);
    },
    move: (move: PlayerMove) => {
      socket.emit(SOCKET_EVENTS.MOVE, move);
    },
    scene,
    isConnected,
    me,
  };
}
