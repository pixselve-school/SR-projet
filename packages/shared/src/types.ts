/**
 * Represents a game map.
 */
export type GameMap = {
  width: number;
  height: number;
  players: Player[];
  food: Food[];
};

/**
 * Represents a player.
 */
export type Player = {
  body: Position[];
  id: string;
  name: string;
  color: string;
  isSprinting: boolean;
  angle: number; // in radians
  desiredAngle: number; // in radians
};

/**
 * Represents a coordinate.
 */
export type Position = {
  x: number;
  y: number;
};

export type Food = {
  id: string;
  position: Position;
};

/**
 * Represents a player move.
 */
export type PlayerMove = {
  angle: number;
  isSprinting: boolean;
};
