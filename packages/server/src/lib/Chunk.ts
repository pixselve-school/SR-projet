import { CHUNK_SIZE, FOOD_POINTS, FOOD_PER_CHUNK } from './constants.js';
import { Orb } from './Orb.js';
import {
  AddOrbView,
  encode,
  PICKUP_RADIUS,
  Position,
  RemoveOrbView,
  SOCKET_EVENTS,
} from '@viper-vortex/shared';
import { Player } from './Player.js';
import { Socket } from 'socket.io';
import { LoadRemoveChunkView } from '@viper-vortex/shared/dist/messages/load-remove-chunk';

export class Chunk {
  constructor(
    public topX: number,
    public topY: number,

    public orbs: Map<string, Orb> = new Map(),

    private players: Map<string, Player> = new Map(),

    public loaded = false,

    public subscribers: Map<string, Socket> = new Map()
  ) {}

  public load() {
    this.loaded = true;
    const orbs = this.generateOrbs();
    this.orbs = orbs.reduce((acc, orb) => {
      acc.set(orb.id, orb);
      return acc;
    }, new Map());
    this.players = new Map();
  }

  public unload() {
    this.loaded = false;
    this.orbs = new Map();
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
    this.orbs.delete(orb.id);
    // broadcast orb removal
    this.subscribers.forEach((socket) => {
      socket.emit(
        SOCKET_EVENTS.REMOVE_ORB,
        encode(
          {
            id: orb.id,
          },
          RemoveOrbView
        )
      );
    });
  }

  public addOrb(orb: Orb) {
    // check if orb is in chunk
    if (!this.isPointInChunk(orb.position)) {
      throw new Error('Orb is not in chunk');
    }
    this.orbs.set(orb.id, orb);
    // broadcast orb addition
    this.subscribers.forEach((socket) => {
      socket.emit(
        SOCKET_EVENTS.ADD_ORB,
        encode(
          [
            {
              id: orb.id,
              x: orb.position.x,
              y: orb.position.y,
              points: orb.points,
              color: orb.colorIndex,
            },
          ],
          AddOrbView
        )
      );
    });
  }

  public subscribe(socket: Socket) {
    this.subscribers.set(socket.id, socket);
    // send a load chunk message
    socket.emit(
      SOCKET_EVENTS.LOAD_CHUNK,
      encode(
        {
          x: this.topX,
          y: this.topY,
        },
        LoadRemoveChunkView
      )
    );
    // send all orbs
    socket.emit(
      SOCKET_EVENTS.ADD_ORB,
      encode(
        Array.from(this.orbs.values()).map((orb) => ({
          id: orb.id,
          x: orb.position.x,
          y: orb.position.y,
          points: orb.points,
          color: orb.colorIndex,
        })),
        AddOrbView
      )
    );
  }

  public unsubscribe(socket: Socket) {
    // send an unload chunk message
    socket.emit(
      SOCKET_EVENTS.REMOVE_CHUNK,
      encode({ x: this.topX, y: this.topY }, LoadRemoveChunkView)
    );
    this.subscribers.delete(socket.id);
  }

  public getCollidingOrbsWithPlayer(player: Player): Orb[] {
    return Array.from(this.orbs.values()).filter((orb) =>
      orb.isColliding(player.head, PICKUP_RADIUS)
    );
  }

  public getCollidingPlayersWithPlayer(player: Player): Player[] {
    return this.playerArray.filter(
      (p) => p.id !== player.id && p.isColliding(player.head, PICKUP_RADIUS)
    );
  }

  private generateOrbs(): Orb[] {
    return new Array(FOOD_PER_CHUNK)
      .fill(0)
      .map(() => new Orb(this.randomPositionInChunk(), FOOD_POINTS));
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
