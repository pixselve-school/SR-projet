import { Coordinate, GameMap } from './types';


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
