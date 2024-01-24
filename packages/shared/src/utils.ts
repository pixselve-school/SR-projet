import { v4 as uuidv4 } from "uuid";
import { Food, GameMap, Player } from "./types";

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
  const food: Food[] = [];
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

export function randomDarkColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor;
}

export function getPlayerHead(player: Player) {
  return player.body[0];
}
