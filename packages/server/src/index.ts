import {
  SceneDTO,
  PlayerDTO,
  SOCKET_EVENTS,
  TPS,
  newScene,
  randomDarkColor,
  randomFood
} from "@viper-vortex/shared";
import { Server, Socket } from "socket.io";
import handleFrame from "./handleFrame.js";

const io = new Server({
  cors: {
    origin: "*", //TODO: change this to the actual frontend url
  },
});

const gameMap: SceneDTO = newScene();

// interval to refill the food
setInterval(() => {
  gameMap.food = gameMap.food.concat(randomFood(2));
}, 1000);

const playerToSocket = new Map<string, Socket>();

io.on(SOCKET_EVENTS.CONNECT, (socket) => {
  console.log(`New connection: ${socket.id}`);

  const player: PlayerDTO = {
    id: socket.id,
    name: "TEMP USERNAME",
    color: randomDarkColor(),
    body: [{ x: 0, y: 0 }],
    isSprinting: false,
    angle: 0,
    desiredAngle: 0,
    orbToDrop: 0,
    score: 0,
  };

  gameMap.players.push(player);
  playerToSocket.set(socket.id, socket);

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`Player ${socket.id} disconnected`);
    const index = gameMap.players.findIndex((p) => p.id === socket.id);
    if (index === -1) return;
    gameMap.players.splice(index, 1);
    playerToSocket.delete(socket.id);
  });

  socket.on(SOCKET_EVENTS.MOVE, (move) => {
    // we rely on the reference to the player object
    player.isSprinting = move.isSprinting;
    player.desiredAngle = move.angle;
  });

  socket.on(SOCKET_EVENTS.JOIN, (name) => {
    player.name = name;
  });
});

setInterval(() => {
  handleFrame(gameMap, onPlayerDeath);
  io.emit(SOCKET_EVENTS.FRAME, gameMap);
}, 1000 / TPS);

function onPlayerDeath(playerId: string) {
  const socket = playerToSocket.get(playerId);
  if (!socket) throw new Error(`No socket for player ${playerId}`);

  socket.emit(SOCKET_EVENTS.DEATH);
  socket.disconnect();
}

io.listen(4000);
