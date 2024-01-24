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
 * The rate at which a player will drop an orb when sprinting.
 */
export const ORB_SPRINTING_DROP_RATE = 0.1;

/**
 * The amount of score gained/lost per orb.
 * You lose orbs when sprinting.
 */
export const SCORE_PER_LOST_ORB = 10;

/**
 * The amount of score gained per orb.
 */
export const SCORE_PER_GAINED_ORB = SCORE_PER_LOST_ORB * 0.3;

/**
 * The amount of score required for each body part.
 */
export const SCORE_PER_BODY_PART = 10;

/**
 * The amount of score gained per food.
 */
export const SCORE_PER_FOOD = SCORE_PER_BODY_PART;

/**
 * The minimum score required to sprint.
 */
export const MIN_SCORE_TO_SPRINT = SCORE_PER_BODY_PART * 4;

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
