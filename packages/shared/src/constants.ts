export const TPS = 60; // ticks per second


/**
 * Enum for socket events.
 * @enum {string}
 */
export enum SOCKET_EVENTS {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MOVE = 'move',
  FRAME = 'frame',
}
