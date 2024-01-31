import {
  Position,
  SceneDTO,
  SCORE_PER_BODY_PART,
  SCORE_PER_GAINED_ORB,
} from '@viper-vortex/shared';
import { Player } from './Player.js';
import { Chunk } from './Chunk.js';
import {
  BODY_PART_PER_ORB,
  CHUNK_SIZE,
  MAP_CHUNKS_WIDTH,
} from './constants.js';
import { Orb } from './Orb.js';

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
    return this.chunks.get(Chunk.getChunkKey(position));
  }

  /**
   * Adds a player to the scene
   * @param player player to add
   */
  public addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  public randomPosition(): Position {
    const randomX = Math.random() * this.width;
    const randomY = Math.random() * this.height;
    return {
      x: randomX,
      y: randomY,
    };
  }

  /**
   * Returns a player from the scene
   * @param id player id
   */
  public getPlayer(id: string) {
    return this.players.get(id);
  }

  /**
   * Removes a player from the scene
   * @param id player id
   */
  public removePlayer(id: string) {
    const player = this.players.get(id);
    if (!player) return;
    this.removePlayerInChunks(player);
    this.players.delete(id);
  }

  /**
   * Updates the scene
   */
  public update() {
    for (let player of this.playerArray) {
      const headChunk = player.headChunk;
      const tailChunk = player.tailChunk;

      player.update(this);
      player.updateHeadTailChunks(this.chunks);

      if (headChunk !== player.headChunk) {
        player.headChunk!.addPlayer(player);
      }

      if (tailChunk && tailChunk !== player.tailChunk) {
        tailChunk!.removePlayer(player);
      }

      // Check if the player has picked up any orbs
      const orbs = player.headChunk!.getCollidingOrbsWithPlayer(player);
      for (let orb of orbs) {
        player.headChunk!.removeOrb(orb);
        player.score += SCORE_PER_GAINED_ORB + orb.size;
      }

      // Check if the player has collided with any other players
      const players = player.headChunk!.getCollidingPlayersWithPlayer(player);
      if (players.length > 0) {
        // drop one orb per 3 body parts

        for (let i = 0; i < player.body.length; i += BODY_PART_PER_ORB) {
          const chunk = this.getChunk(player.body[i]);
          if (chunk) {
            chunk.addOrb(
              new Orb(
                {
                  x: player.body[i].x,
                  y: player.body[i].y,
                },
                BODY_PART_PER_ORB * SCORE_PER_BODY_PART,
                player.color
              )
            );
          }
        }
        player.emitDeathAndDisconnectSocket();
      }
    }

    // Unload / load chunks
    const allChunksInView = new Set<Chunk>();
    for (let player of this.playerArray) {
      const chunksInView = player.chunksInView(this.chunks);
      chunksInView.forEach((c) => allChunksInView.add(c));
    }
    this.chunks.forEach((chunk) => {
      if (!allChunksInView.has(chunk)) {
        if (chunk.loaded) chunk.unload();
      } else {
        if (!chunk.loaded) chunk.load();
      }
    });
  }

  private removePlayerInChunks(player: Player) {
    this.chunks.forEach((chunk) => {
      chunk.removePlayer(player);
    });
  }

  /**
   * Returns the players in the scene
   */
  get playerArray(): Player[] {
    return Array.from(this.players.values());
  }

  /**
   * Returns the scene data for a player
   * @param player player to get the data for
   */
  public povDto(player: Player): SceneDTO {
    const uniquePlayers = new Set<Player>();
    uniquePlayers.add(player);
    player.chunksInView(this.chunks).forEach((c) => {
      c.playerArray.forEach((p) => uniquePlayers.add(p));
    });

    return {
      width: this.width,
      height: this.height,
      players:
        uniquePlayers.size > 0
          ? Array.from(uniquePlayers).map((p) => p.dto)
          : [],
      orbs: player
        .chunksInView(this.chunks)
        .flatMap((c) => c.orbs.map((o) => o.dto)),
    };
  }

  /**
   * Returns the top players
   * @param amount amount of players to return
   */
  public getTopPlayers(amount: number = 10): Player[] {
    return this.playerArray.sort((a, b) => b.score - a.score).slice(0, amount);
  }
}
