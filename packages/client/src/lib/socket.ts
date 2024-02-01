"use client";
import { io } from "socket.io-client";
import {
  AddOrbView,
  colors,
  decode,
  RemoveOrbView,
  SceneDTO,
  SOCKET_EVENTS,
} from "@viper-vortex/shared";
import { signal } from "@preact/signals-core";
import { Game } from "@/lib/Game";

export const isConnected = signal(false);

export const scores = signal<{ name: string; score: number }[]>([]);

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

let _username = "";

export const socket = io(URL!, {
  autoConnect: false,
});

export function connect(url: string, username: string) {
  // https://github.com/socketio/socket.io/discussions/4246#discussioncomment-1952661
  // @ts-ignore
  socket.io.uri = url;
  socket.connect();
  _username = username;
}

export function disconnect() {
  console.log("disconnecting");
  socket.disconnect();
  isConnected.value = false;
  Game.destroy();
}

export function move(angle: number, isSprinting: boolean) {
  socket.emit(SOCKET_EVENTS.MOVE, { angle, isSprinting });
}

socket.on(SOCKET_EVENTS.ADD_ORB, handleAddOrb);
socket.on(SOCKET_EVENTS.SCORES, handleUpdateScores);
socket.on(SOCKET_EVENTS.FRAME, handleFrame);
socket.on(SOCKET_EVENTS.REMOVE_ORB, handleOrbDelete);
socket.on(SOCKET_EVENTS.DISCONNECT, disconnect);
socket.on(SOCKET_EVENTS.CONNECT, handleConnect);

function handleConnect() {
  socket.emit(SOCKET_EVENTS.JOIN, _username);
  Game.create();
  isConnected.value = true;
}

function handleAddOrb(orbsToAddBuffer: ArrayBuffer) {
  const orbsToAdd = decode(orbsToAddBuffer, AddOrbView);
  Game.instance?.addOrbs(
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

function handleOrbDelete(orbsToDeleteBuffer: ArrayBuffer) {
  const orbsToDelete = decode(orbsToDeleteBuffer, RemoveOrbView);
  Game.instance?.removeOrb(orbsToDelete.id);
}

function handleUpdateScores(newScores: { name: string; score: number }[]) {
  scores.value = newScores;
}

function handleFrame(frame: SceneDTO) {
  Game.instance?.setScene(frame);
}
