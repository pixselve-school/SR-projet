export const TPS = 60; // ticks per second

export const BASE_SPEED = 2;
export const SPRINT_SPEED = 4;

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
