import { CHUNK_SIZE, FOOD_ORB_SIZE, FOOD_PER_CHUNK } from "./constants";
import { Orb } from "./Orb.js";
import { FOOD_PICKUP_RADIUS, Position } from "@viper-vortex/shared";
import { Player } from "./Player.js";

export class Chunk {
  constructor(
    public topX: number,
    public topY: number,
    public orbs: Orb[] = [],
    public players: Map<string, Player> = new Map(),
  ) {
    this.orbs = this.generateOrbs();
  }

  public toString(): string {
    return `${this.topX},${this.topY}`;
  }

  get bottomX() {
    return this.topX + CHUNK_SIZE;
  }

  get bottomY() {
    return this.topY + CHUNK_SIZE;
  }

  public removeOrb(orb: Orb) {
    this.orbs = this.orbs.filter((o) => o.id !== orb.id);
  }

  public getCollidingOrbsWithPlayer(player: Player): Orb[] {
    return this.orbs.filter((orb) =>
      orb.isColliding(player.head, FOOD_PICKUP_RADIUS),
    );
  }

  private generateOrbs(): Orb[] {
    return new Array(FOOD_PER_CHUNK)
      .fill(0)
      .map(() => new Orb(this.randomPositionInChunk(), FOOD_ORB_SIZE));
  }

  private randomPositionInChunk(): Position {
    return {
      x: Math.floor(Math.random() * CHUNK_SIZE) + this.topX,
      y: Math.floor(Math.random() * CHUNK_SIZE) + this.topY,
    };
  }

  public isPointInChunk(position: Position): boolean {
    return (
      position.x >= this.topX &&
      position.x <= this.bottomX &&
      position.y >= this.topY &&
      position.y <= this.bottomY
    );
  }
}
