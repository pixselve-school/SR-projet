import {
  BASE_SPEED,
  MAX_ANGLE,
  MIN_SCORE_TO_SPRINT,
  ORB_SPRINTING_DROP_RATE,
  PlayerDTO,
  PlayerMoveDTO,
  Position,
  randomDarkColor,
  SCORE_PER_BODY_PART,
  SCORE_PER_LOST_ORB,
  SOCKET_EVENTS,
  SPRINT_SPEED,
} from "@viper-vortex/shared";
import { Socket } from "socket.io";
import { Scene } from "./Scene.js";
import { Chunk } from "./Chunk.js";
import { CHUNK_SIZE, RENDER_DISTANCE } from "./constants.js";
import { Orb } from "./Orb";

export class Player {
  private isSprinting: boolean = false;
  // in radians
  private angle: number = 0;
  // in radians
  private desiredAngle: number = 0;
  // 0 - 1: will vary based on `ORB_SPRINTING_DROP_RATE`
  private orbToDrop: number = 0;
  public score: number = 0;
  public body: Position[] = [];
  private readonly color: string;

  public headChunk: Chunk | undefined;
  public tailChunk: Chunk | undefined;

  constructor(
    public readonly socket: Socket,
    public name: string,
  ) {
    this.color = randomDarkColor();
    this.body.push({
      x: 0,
      y: 0,
    });
  }

  /**
   * The player's data transfer object.
   */
  get dto(): PlayerDTO {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      body: this.body,
      score: this.score,
    };
  }

  /**
   * The player's socket id.
   */
  get id(): string {
    return this.socket.id;
  }

  get head(): Position {
    if (this.body.length === 0) {
      throw new Error("Player has no body");
    }
    return this.body[0];
  }

  get tail(): Position {
    if (this.body.length === 0) {
      throw new Error("Player has no body");
    }
    return this.body[this.body.length - 1];
  }

  get canSprint(): boolean {
    return this.score >= MIN_SCORE_TO_SPRINT;
  }

  get speed(): number {
    return this.canSprint && this.isSprinting ? SPRINT_SPEED : BASE_SPEED;
  }

  public chunksInView(chunks: Map<string, Chunk>): Chunk[] {
    const headChunk = this.headChunk;
    if (!headChunk) {
      return [];
    }
    const chunksInView: Chunk[] = [];
    const renderDistance = RENDER_DISTANCE;
    for (let x = -renderDistance; x <= renderDistance; x++) {
      for (let y = -renderDistance; y <= renderDistance; y++) {
        const chunk = chunks.get(
          `${headChunk.topX / CHUNK_SIZE + x},${headChunk.topY / CHUNK_SIZE + y}`,
        );
        if (chunk) {
          chunksInView.push(chunk);
        }
      }
    }
    return chunksInView;
  }

  public updateHeadTailChunks(chunks: Map<string, Chunk>) {
    if (!this.headChunk || !this.tailChunk) {
      this.headChunk = chunks.get(Chunk.getChunkKey(this.head));
      this.tailChunk = chunks.get(Chunk.getChunkKey(this.tail));
      return;
    }
    if (!this.headChunk.isPointInChunk(this.head)) {
      // Update the player's chunk
      this.headChunk = chunks.get(Chunk.getChunkKey(this.head));
    }
    if (!this.tailChunk.isPointInChunk(this.tail)) {
      // Update the player's chunk
      this.tailChunk = chunks.get(Chunk.getChunkKey(this.tail));
    }
  }

  public isColliding(position: Position, radius: number): boolean {
    for (let bodyPart of this.body) {
      if (
        Math.abs(bodyPart.x - position.x) < radius &&
        Math.abs(bodyPart.y - position.y) < radius
      ) {
        return true;
      }
    }
    return false;
  }

  public emitDeathAndDisconnectSocket() {
    this.socket.emit(SOCKET_EVENTS.DEATH);
    this.socket.disconnect();
  }

  public userMove(move: PlayerMoveDTO) {
    this.isSprinting = move.isSprinting;
    this.desiredAngle = move.angle;
  }

  public update(scene: Scene) {
    if (this.isSprinting && this.canSprint) {
      this.orbToDrop += ORB_SPRINTING_DROP_RATE;
      if (this.orbToDrop >= 1) {
        this.orbToDrop -= 1;
        // drop an orb
        this.tailChunk?.addOrb(
          new Orb(
            {
              x: this.tail.x,
              y: this.tail.y,
            },
            1,
            this.color,
          ),
        );

        this.score -= SCORE_PER_LOST_ORB;
      }
    }

    const currentAngle = this.angle;
    const targetAngle = this.desiredAngle;

    // calculate the angle to turn
    let angleDiff = targetAngle - currentAngle;
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // limit the angle to turn
    if (angleDiff > MAX_ANGLE) angleDiff = MAX_ANGLE;
    if (angleDiff < -MAX_ANGLE) angleDiff = -MAX_ANGLE;

    // apply the angle
    this.angle += angleDiff;

    this.head.x += Math.cos(this.angle) * this.speed;
    this.head.y += Math.sin(this.angle) * this.speed;

    // if the player reaches the edge of the map, slides along the edge
    if (this.head.x < 0) this.head.x = 0;
    if (this.head.y < 0) this.head.y = 0;
    if (this.head.x > scene.width) this.head.x = scene.width;
    if (this.head.y > scene.height) this.head.y = scene.height;

    // then all the other body parts follow by moving to the position of the previous body part
    for (let i = this.body.length - 1; i > 0; i--) {
      const currentPart = this.body[i];
      const previousPart = this.body[i - 1];
      currentPart.x = previousPart.x;
      currentPart.y = previousPart.y;
    }

    this.updateBody();
  }

  public updateBody() {
    const newLength = Math.max(1, Math.floor(this.score / SCORE_PER_BODY_PART));

    while (this.body.length < newLength) {
      this.body.push({
        x: this.body[this.body.length - 1].x,
        y: this.body[this.body.length - 1].y,
      });
    }
    while (this.body.length > newLength) {
      this.body.pop();
    }
  }
}
