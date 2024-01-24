/**
 * The number of ticks per second.
 */
export const TPS = 60;

/**
 * The speed at which the player moves when walking.
 */
export const BASE_SPEED = 2;
/**
 * The speed at which the player moves when sprinting.
 */
export const SPRINT_SPEED = 5;

/**
 * The radius of the player's head.
 */
export const FOOD_PICKUP_RADIUS = 20;

/**
 * The maximum angle the player can turn in one tick.
 */
export const MAX_ANGLE = Math.PI / 20;

/**
 * Enum for socket events.
 * @enum {string}
 */
export enum SOCKET_EVENTS {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  MOVE = "move",
  FRAME = "frame",
  DEATH = "death",
}
