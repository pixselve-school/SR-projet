import {
  SOCKET_EVENTS,
  TPS,
  PlayerMoveDTO,
  orbsToPacket,
} from '@viper-vortex/shared';
import { Server } from 'socket.io';
import { Player } from './lib/Player.js';
import { Scene } from './lib/Scene.js';
import { SEND_SCORES_INTERVAL } from './lib/constants.js';

const io = new Server({
  cors: {
    origin: '*', //TODO: change this to the actual frontend url
  },
});

const scene = new Scene();

io.on(SOCKET_EVENTS.CONNECT, (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on(SOCKET_EVENTS.JOIN, (name) => {
    console.log(`Player ${socket.id} joined as ${name}`);
    const player = new Player(socket, name, scene.randomPosition());
    scene.addPlayer(player);
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`Player ${socket.id} disconnected`);
    scene.removePlayer(socket.id);
  });

  socket.on(SOCKET_EVENTS.MOVE, (move: PlayerMoveDTO) => {
    const player = scene.getPlayer(socket.id);
    if (!player) {
      console.error(`Player ${socket.id} tried to move before joining`);
      socket.disconnect();
      return;
    }
    player.userMove(move);
  });
});

setInterval(() => {
  scene.update();
  for (let player of scene.playerArray) {
    const { orbs, ...scenePov } = scene.povDto(player);
    player.socket.emit(SOCKET_EVENTS.FRAME, { ...scenePov, orbs: [] });
    player.socket.emit(
      SOCKET_EVENTS.ORBS,
      orbsToPacket(
        orbs.map((orb) => ({
          y: orb.position.y,
          x: orb.position.x,
          points: orb.points,
          color: orb.colorIndex,
          id: orb.id,
        }))
      )
    );
  }
}, 1000 / TPS);

setInterval(() => {
  io.emit(
    SOCKET_EVENTS.SCORES,
    scene
      .getTopPlayers()
      .map((player) => ({ name: player.name, score: player.score }))
  );
}, SEND_SCORES_INTERVAL);

io.listen(4000);
