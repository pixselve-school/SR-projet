import { CHUNK_SIZE, FOOD_ORB_SIZE, FOOD_PER_CHUNK } from "./constants";
import { Orb } from "./Orb.js";
import { FOOD_PICKUP_RADIUS, Position } from "@viper-vortex/shared";
import { Player } from "./Player.js";

export class Chunk {
  constructor(
    public topX: number,
    public topY: number,
    public orbs: Orb[] = [],
    private players: Map<string, Player> = new Map(),
    public loaded = false,
  ) {}

  public load() {
    this.loaded = true;
    this.orbs = this.generateOrbs();
    this.players = new Map();
  }

  public unload() {
    this.loaded = false;
    this.orbs = [];
  }

  public removePlayer(player: Player) {
    this.players.delete(player.id);
  }

  public addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  public get playerArray(): Player[] {
    return Array.from(this.players.values());
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

  public addOrb(orb: Orb) {
    // check if orb is in chunk
    if (!this.isPointInChunk(orb.position)) {
      throw new Error("Orb is not in chunk");
    }
    this.orbs.push(orb);
  }

  public getCollidingOrbsWithPlayer(player: Player): Orb[] {
    return this.orbs.filter((orb) =>
      orb.isColliding(player.head, FOOD_PICKUP_RADIUS),
    );
  }

  public getCollidingPlayersWithPlayer(player: Player): Player[] {
    return this.playerArray.filter(
      (p) =>
        p.id !== player.id && p.isColliding(player.head, FOOD_PICKUP_RADIUS),
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

  /**
   * Returns the chunk key for a given position.
   * @param position position
   */
  public static getChunkKey(position: Position): string {
    return `${Math.floor(position.x / CHUNK_SIZE)},${Math.floor(position.y / CHUNK_SIZE)}`;
  }
}
