import { io } from 'socket.io-client';
import { SOCKET_EVENTS, TPS } from '@viper-vortex/shared';

const URL = process.env.URL || 'http://localhost:4000';
const CLIENT_COUNT = process.env.CLIENT_COUNT
  ? parseInt(process.env.CLIENT_COUNT)
  : 50;

console.log(`🔗 Using URL: ${URL}`);

console.log(`👥 Creating ${CLIENT_COUNT} clients`);

let frameCounter = 0;
let averageTPS = 0;

setInterval(() => {
  averageTPS = frameCounter / CLIENT_COUNT;
  console.log(
    `🙋 Clients ${CLIENT_COUNT} | ⌛️ Average TPS: ${averageTPS} (should be ${TPS})`
  );
  frameCounter = 0; // reset counter
}, 1000); // every second

const clients = new Array(CLIENT_COUNT).fill(0).map((_, i) => {
  const name = `Chaos Player ${i}`;
  const socket = io(URL);

  socket.emit(SOCKET_EVENTS.JOIN, name);

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    socket.connect();
    socket.emit(SOCKET_EVENTS.JOIN, name);
  });

  // Randomly move the player
  setInterval(() => {
    socket.emit(SOCKET_EVENTS.MOVE, {
      angle: Math.random() * Math.PI * 2, // Random angle in radians
      isSprinting: Math.random() > 0.02,
    });
  }, 1000);

  socket.on(SOCKET_EVENTS.FRAME, (frame) => {
    frameCounter++; // increment counter each time a frame is received
  });

  return { name, socket };
});

console.log(`🎮 Players joined`);
