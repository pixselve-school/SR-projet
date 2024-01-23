import { Server } from "socket.io";
import {
  GameMap,
  newGameMap,
  Player,
  randomFood,
  SOCKET_EVENTS,
  TPS,
} from "@viper-vortex/shared";
import handleFrame from "./handleFrame";

const io = new Server({
  cors: {
    origin: "*",
  },
});

const gameMap: GameMap = newGameMap();

// interval to refill the food
setInterval(() => {
  gameMap.food = gameMap.food.concat(randomFood(2));
}, 1000);

io.on(SOCKET_EVENTS.CONNECT, (socket) => {
  console.log(`New connection: ${socket.id}`);

  const player: Player = {
    id: socket.id,
    name: "Player 1",
    color: "#000000",
    body: [{ x: 0, y: 0 }],
    isSprinting: false,
    angle: 0,
  };

  gameMap.players.push(player);

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`Player ${socket.id} disconnected`);
    const index = gameMap.players.findIndex((p) => p.id === socket.id);
    if (index === -1) return;
    gameMap.players.splice(index, 1);
  });

  socket.on(SOCKET_EVENTS.MOVE, (move) => {
    // we rely on the reference to the player object
    player.isSprinting = move.isSprinting;
    player.angle = move.angle;
  });
});

setInterval(() => {
  handleFrame(gameMap);
  io.emit(SOCKET_EVENTS.FRAME, gameMap);
}, 1000 / TPS);

io.listen(4000);
