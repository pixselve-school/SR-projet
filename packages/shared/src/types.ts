/**
 * Represents a game map.
 */
export type SceneDTO = {
  width: number;
  height: number;
  players: PlayerDTO[];
  food: FoodDTO[];
  orbs: OrbDTO[];
};

/**
 * Represents a player.
 */
export type PlayerDTO = {
  body: Position[];
  id: string;
  name: string;
  color: string;
  score: number;
};

/**
 * Represents an orb. Orbs are used to grow the player.
 * They are dropped by players when they die.
 * They are also dropped when a player sprints.
 */
export type OrbDTO = {
  id: string;
  position: Position;
  // 1 - 10
  size: number;
};

export type FoodDTO = {
  id: string;
  position: Position;
};

/**
 * Represents a coordinate.
 */
export type Position = {
  x: number;
  y: number;
};

/**
 * Represents a player move.
 */
export type PlayerMoveDTO = {
  angle: number;
  isSprinting: boolean;
};
