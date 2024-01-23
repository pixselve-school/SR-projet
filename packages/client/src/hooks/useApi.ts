import {
  type Player,
  SOCKET_EVENTS,
  type GameMap,
  type PlayerMove,
} from "@viper-vortex/shared";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

export function useApi() {
  const [socket] = useState(io(URL!, { autoConnect: false }));
  const [isConnected, setIsConnected] = useState(false);
  const [scene, setScene] = useState<GameMap | undefined>();
  const [me, setMe] = useState<Player | undefined>();

  useEffect(() => {
    if (!scene) return;
    setMe(scene.players.find((p) => p.id === socket.id));
  }, [scene, socket.id]);

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true);
    }
    function handleDisconnect() {
      setIsConnected(false);
    }
    function handleFrame(scene: GameMap) {
      setScene(scene);
    }
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(SOCKET_EVENTS.FRAME, handleFrame);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(SOCKET_EVENTS.FRAME, handleFrame);
    };
  }, [socket]);

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
