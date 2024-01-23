import { v4 as uuidv4 } from "uuid";
import { FoodDTO, GameMap } from "./types";

/**
 * Create a new game map.
 * @returns {GameMap} The new game map.
 * @todo Handle food.
 */
export function newGameMap(): GameMap {
  const AMOUNT_OF_FOOD = 100;
  return {
    width: 1000,
    height: 1000,
    players: [],
    food: randomFood(AMOUNT_OF_FOOD),
  };
}

export function randomFood(number: number = 1) {
  const food: FoodDTO[] = [];
  for (let i = 0; i < number; i++) {
    food.push({
      id: uuidv4(),
      position: {
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 1000),
      },
    });
  }
  return food;
}
