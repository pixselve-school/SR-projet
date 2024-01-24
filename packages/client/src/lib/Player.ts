import { worldToScreen } from "@/utils/position";
import { type PlayerDTO, type Position } from "@viper-vortex/shared";
import { Entity } from "./Entity";
import { type Game } from "./Game";

export class Player extends Entity {
  body: Position[];
  name: string;
  color: string;
  isSprinting: boolean;
  angle: number;

  constructor(p: PlayerDTO, game: Game) {
    super(p.id, game);
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

  draw(): void {
    const c = this.game.c;
    if (!c || this.body.length === 0) return;

    c.beginPath();

    let prevScreenBodyPart = worldToScreen(this.body[0]!, this.game.camera);
    c.moveTo(prevScreenBodyPart.x, prevScreenBodyPart.y);

    this.body.forEach((bodyPart, index) => {
      if (index === 0) return;
      const screenBodyPart = worldToScreen(bodyPart, this.game.camera);
      c.lineTo(screenBodyPart.x, screenBodyPart.y);
      prevScreenBodyPart = screenBodyPart;
    });

    if (this.body.length === 1) {
      c.lineTo(prevScreenBodyPart.x, prevScreenBodyPart.y);
    }

    c.lineWidth = 20;
    c.strokeStyle = this.color;
    c.lineCap = "round";
    c.lineJoin = "round";

    c.stroke();
  }

  getHead() {
    return this.body[0];
  }
}
