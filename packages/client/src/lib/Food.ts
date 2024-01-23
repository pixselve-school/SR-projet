import { worldToScreen } from '@/utils/position';
import { type FoodDTO, type Position } from '@viper-vortex/shared';
import { Entity, type UpdateContext } from './Entity';

export class Food extends Entity {
  position: Position;
  constructor(food: FoodDTO) {
    super(food.id);
    this.position = food.position;
  }

  update(food: FoodDTO) {
    this.position = food.position;
  }

  draw({c,camera}: UpdateContext): void {
    const screenFood = worldToScreen(this.position, camera);
    c.beginPath();
    c.arc(screenFood.x, screenFood.y, 10, 0, 2 * Math.PI);
    c.fillStyle = 'green';
    c.fill();
  }
}