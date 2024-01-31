import {
  OrbDTO,
  Position,
  getOrbSizeFromPoints,
  randomDarkColor,
} from '@viper-vortex/shared';
import { uid } from './utils';

export class Orb {
  public readonly id: string;
  public readonly size: number;
  constructor(
    public position: Position,
    public points: number,
    public color: string = randomDarkColor()
  ) {
    this.id = uid.rnd();
    this.size = getOrbSizeFromPoints(this.points);
  }

  get dto(): OrbDTO {
    return {
      id: this.id,
      position: this.position,
      points: this.points,
      color: this.color,
    };
  }

  public isColliding(position: Position, radius: number): boolean {
    const distance = Math.sqrt(
      Math.pow(position.x - this.position.x, 2) +
        Math.pow(position.y - this.position.y, 2)
    );
    return distance < radius + this.size;
  }
}
