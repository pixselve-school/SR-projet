import { SOCKET_EVENTS, TPS, PlayerMoveDTO } from "@viper-vortex/shared";
import { Server } from "socket.io";
import { Player } from "./lib/Player.js";
import { Scene } from "./lib/Scene.js";
import { SEND_SCORES_INTERVAL } from "./lib/constants";

const io = new Server({
  cors: {
    origin: "*", //TODO: change this to the actual frontend url
  },
});

const scene = new Scene();

io.on(SOCKET_EVENTS.CONNECT, (socket) => {
  console.log(`New connection: ${socket.id}`);

  const player = new Player(socket, "Anonymous");

  scene.addPlayer(player);

  socket.on(SOCKET_EVENTS.JOIN, (name) => {
    player.name = name;
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`Player ${socket.id} disconnected`);
    scene.removePlayer(socket.id);
  });

  socket.on(SOCKET_EVENTS.MOVE, (move: PlayerMoveDTO) => {
    player.userMove(move);
  });
});

setInterval(() => {
  scene.update();

  for (let player of scene.playerArray) {
    player.socket.emit(SOCKET_EVENTS.FRAME, scene.povDto(player));
  }
}, 1000 / TPS);

setInterval(() => {
  io.emit(
    SOCKET_EVENTS.SCORES,
    scene
      .getTopPlayers()
      .map((player) => ({ name: player.name, score: player.score })),
  );
}, SEND_SCORES_INTERVAL);

io.listen(4000);
