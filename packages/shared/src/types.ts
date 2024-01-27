/**
 * Represents a game map.
 */
export type SceneDTO = {
  width: number;
  height: number;
  players: PlayerDTO[];
  /**
   * @deprecated use orbs instead
   */
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
  /**
   * between 1 and 10, this will impact the size of the orb and the amount of points it gives.
   */
  size: number;
  color: string;
} & FoodDTO;

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

export type ScoresDTO = {
  name: string;
  score: number;
}[];
