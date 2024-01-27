import { OrbDTO, Position, randomDarkColor } from "@viper-vortex/shared";
import { v4 as uuidv4 } from "uuid";

export class Orb {
  public readonly id: string;
  constructor(
    public position: Position,
    public size: number,
    public color: string = randomDarkColor(),
  ) {
    this.id = uuidv4();
  }

  get dto(): OrbDTO {
    return {
      id: this.id,
      position: this.position,
      size: this.size,
      color: this.color,
    };
  }

  public isColliding(position: Position, radius: number): boolean {
    const distance = Math.sqrt(
      Math.pow(position.x - this.position.x, 2) +
        Math.pow(position.y - this.position.y, 2),
    );
    return distance < radius + this.size;
  }
}
