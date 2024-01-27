import {
  FIELD_OF_VIEW_RADIUS,
  FOOD_PICKUP_RADIUS,
  FoodDTO,
  MAP_HEIGHT,
  MAP_WIDTH,
  OrbDTO,
  Position,
  SceneDTO,
  SCORE_PER_FOOD,
  SCORE_PER_GAINED_ORB,
} from "@viper-vortex/shared";
import { Player } from "./Player.js";
import { v4 as uuidv4 } from "uuid";
import { Chunk } from "./Chunk.js";
import { CHUNK_SIZE, MAP_CHUNKS_WIDTH } from "./constants.js";

export class Scene {
  public readonly width: number;
  public readonly height: number;
  private players: Map<string, Player> = new Map();
  private chunks: Map<string, Chunk> = new Map();

  constructor() {
    this.width = MAP_CHUNKS_WIDTH * CHUNK_SIZE;
    this.height = MAP_CHUNKS_WIDTH * CHUNK_SIZE;

    // Generate all the chunks
    for (let x = 0; x < MAP_CHUNKS_WIDTH; x++) {
      for (let y = 0; y < MAP_CHUNKS_WIDTH; y++) {
        this.chunks.set(`${x},${y}`, new Chunk(x * CHUNK_SIZE, y * CHUNK_SIZE));
      }
    }
  }

  /**
   * Returns the chunk that the position is in
   * @param position position to check
   */
  public getChunk(position: Position): Chunk | undefined {
    const x = Math.floor(position.x / CHUNK_SIZE);
    const y = Math.floor(position.y / CHUNK_SIZE);
    return this.chunks.get(`${x},${y}`);
  }

  /**
   * Adds random food to the scene
   * @param number number of food to add
   */
  public addRandomFood(number: number = 1) {
    // for (let i = 0; i < number; i++) {
    //   this.food.push({
    //     id: uuidv4(),
    //     position: {
    //       x: Math.floor(Math.random() * this.width),
    //       y: Math.floor(Math.random() * this.height),
    //     },
    //   });
    // }
  }

  /**
   * Adds a player to the scene
   * @param player player to add
   */
  public addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  /**
   * Removes a player from the scene
   * @param id player id
   */
  public removePlayer(id: string) {
    this.players.delete(id);
  }

  public addOrb(position: Position, size: number) {
    // this.orbs.push({
    //   id: uuidv4(),
    //   position,
    //   size,
    // });
  }

  public update() {
    for (let player of this.playerArray) {
      player.update(this);

      // Update the player's chunk
      if (player.chunk === undefined) {
        player.chunk = this.getChunk(player.head);
      } else {
        // Check if the player has moved to a new chunk
        if (!player.chunk.isPointInChunk(player.head)) {
          // Update the player's chunk
          player.chunk = this.getChunk(player.head);
        }
      }

      // Check if the player has picked up any orbs
      const orbs = player.chunk!.getCollidingOrbsWithPlayer(player);
      for (let orb of orbs) {
        player.chunk!.removeOrb(orb);
        player.score += SCORE_PER_GAINED_ORB + orb.size;
      }
    }
  }

  /**
   * Returns the players in the scene
   */
  get playerArray(): Player[] {
    return Array.from(this.players.values());
  }

  get orbsArray(): OrbDTO[] {
    return Array.from(this.chunks.values()).flatMap((c) =>
      c.orbs.map((o) => o.dto),
    );
  }

  get dto(): SceneDTO {
    return {
      width: this.width,
      height: this.height,
      players: this.playerArray.map((p) => p.dto),
      food: [], // TODO: Deprecate food => replace with orbs
      orbs: this.orbsArray,
    };
  }

  public povDto(player: Player): SceneDTO {
    return {
      width: this.width,
      height: this.height,
      players: this.playerArray.map((p) => p.dto),
      food: [], // TODO: Deprecate food => replace with orbs
      orbs: player
        .chunksInView(this.chunks)
        .flatMap((c) => c.orbs.map((o) => o.dto)),
    };
  }
}
