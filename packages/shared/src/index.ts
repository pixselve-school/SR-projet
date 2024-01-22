/**
 * Represents a game map.
 */
export type GameMap = {
  width: number;
  height: number;
  players: Player[];
  food: Coordinate[];
}

/**
 * Represents a player.
 */
export type Player = {
  body: Coordinate[];
  id: string;
  name: string;
  color: string;
  isSprinting: boolean;
  angle: number;
}

/**
 * Represents a coordinate.
 */
export type Coordinate = {
  x: number;
  y: number;
}

/**
 * Represents a player move.
 */
export type PlayerMove = {
  angle: number;
  isSprinting: boolean;
}

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

/**
 * Create a new game map.
 * @returns {GameMap} The new game map.
 * @todo Handle food.
 */
export function newGameMap(): GameMap {
  const AMOUNT_OF_FOOD = 100;
  const food: Coordinate[] = [];
  for (let i = 0; i < AMOUNT_OF_FOOD; i++) {
    food.push({
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 1000),
    });
  }
  return {
    width: 1000,
    height: 1000,
    players: [],
    food: food,
  };
}
