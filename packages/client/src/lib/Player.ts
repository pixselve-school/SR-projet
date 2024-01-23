import { worldToScreen } from "@/utils/position";
import { type PlayerDTO, type Position } from "@viper-vortex/shared";
import { Entity, type UpdateContext } from "./Entity";

export class Player extends Entity {
  body: Position[];
  name: string;
  color: string;
  isSprinting: boolean;
  angle: number;

  constructor(p: PlayerDTO) {
    super(p.id);
    this.body = p.body;
    this.name = p.name;
    this.color = p.color;
    this.isSprinting = p.isSprinting;
    this.angle = p.angle;
  }

  update(p: PlayerDTO) {
    this.body = p.body;
    this.name = p.name;
    this.color = p.color;
    this.isSprinting = p.isSprinting;
    this.angle = p.angle;
  }

  draw({ c, camera }: UpdateContext): void {

    // if (IS ME) {
    //   const playerHead = this.getHead();
    //   if (playerHead) {
    //     const screenHead = worldToScreen(playerHead, camera);
    //     const screenCurPos = worldToScreen(cursor, camera);
    //     c.beginPath();
    //     c.moveTo(screenHead.x, screenHead.y);
    //     c.lineTo(screenCurPos.x, screenCurPos.y);
    //     c.fillStyle = 'red';
    //     c.strokeStyle = 'red';
    //     c.stroke();
    //   }
    // }

    this.body.forEach((bodyPart) => {
      const screenBodyPart = worldToScreen(bodyPart, camera);
      c.beginPath();
      c.arc(screenBodyPart.x, screenBodyPart.y, 10, 0, 2 * Math.PI);
      c.fillStyle = this.color;
      c.fill();
      c.strokeStyle = this.color;
      c.stroke();
    });
  }

  getHead() {
    return this.body[0];
  }
}
