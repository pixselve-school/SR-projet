/**
 * Represents a game map.
 */
export type GameMap = {
  width: number;
  height: number;
  players: PlayerDTO[];
  food: FoodDTO[]
}

/**
 * Represents a player.
 */
export type PlayerDTO = {
  body: Position[];
  id: string;
  name: string;
  color: string;
  isSprinting: boolean;
  angle: number;
}

/**
 * Represents a coordinate.
 */
export type Position = {
  x: number;
  y: number;
}

export type FoodDTO = {
  id: string;
  position: Position;
}

/**
 * Represents a player move.
 */
export type PlayerMove = {
  angle: number;
  isSprinting: boolean;
}
