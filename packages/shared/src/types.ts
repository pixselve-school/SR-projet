/**
 * Represents a game map.
 */
export type GameMap = {
  width: number;
  height: number;
  players: Player[];
  food: Food[];
  orbs: Orb[];
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
  // in radians
  angle: number;
  // in radians
  desiredAngle: number;
  // 0 - 1: will vary based on `ORB_SPRINTING_DROP_RATE`
  orbToDrop: number;
};

/**
 * Represents an orb. Orbs are used to grow the player.
 * They are dropped by players when they die.
 * They are also dropped when a player sprints.
 */
export type Orb = {
  id: string;
  position: Position;
  // 1 - 10
  size: number;
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
