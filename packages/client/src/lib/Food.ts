import { worldToScreen } from "@/utils/position";
import { type FoodDTO, type Position } from "@viper-vortex/shared";
import { Entity } from "./Entity";
import { type Game } from "./Game";

export class Food extends Entity {
  position: Position;
  constructor(food: FoodDTO, game: Game) {
    super(food.id, game);
    this.position = food.position;
  }

  update(food: FoodDTO) {
    this.position = food.position;
  }

  draw(): void {
    const c = this.game.c;
    if (!c) return;
    const screenFood = worldToScreen(this.position, this.game.camera);
    c.beginPath();
    c.arc(screenFood.x, screenFood.y, 10, 0, 2 * Math.PI);
    c.fillStyle = "green";
    c.fill();
  }
}
