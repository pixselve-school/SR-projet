import {
  BASE_SPEED,
  FOOD_PICKUP_RADIUS,
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

export class Player {
  private isSprinting: boolean = false;
  // in radians
  private angle: number = 0;
  // in radians
  private desiredAngle: number = 0;
  // 0 - 1: will vary based on `ORB_SPRINTING_DROP_RATE`
  private orbToDrop: number = 0;
  public score: number = 0;
  private body: Position[] = [];
  private color: string;

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

  public emitDeathAndDisconnectSocket() {
    this.socket.emit(SOCKET_EVENTS.DEATH);
    this.socket.disconnect();
  }

  public userMove(move: PlayerMoveDTO) {
    this.isSprinting = move.isSprinting;
    this.desiredAngle = move.angle;
  }

  public isHeadColliding(other: Player): boolean {
    if (this.id === other.id) {
      return false;
    }
    for (let otherBodyPart of other.body) {
      if (
        Math.abs(otherBodyPart.x - this.head.x) < FOOD_PICKUP_RADIUS &&
        Math.abs(otherBodyPart.y - this.head.y) < FOOD_PICKUP_RADIUS
      ) {
        return true;
      }
    }
    return false;
  }

  public update(scene: Scene) {
    if (this.isSprinting && this.canSprint) {
      this.orbToDrop += ORB_SPRINTING_DROP_RATE;
      if (this.orbToDrop >= 1) {
        this.orbToDrop -= 1;
        // drop an orb
        scene.addOrb(
          {
            x: this.tail.x,
            y: this.tail.y,
          },
          1,
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
