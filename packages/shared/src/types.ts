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

export type Position = Coordinate;

/**
 * Represents a player move.
 */
export type PlayerMove = {
  angle: number;
  isSprinting: boolean;
}
