import { worldToScreen } from "@/utils/position";
import { type PlayerDTO, type Position } from "@viper-vortex/shared";
import { Entity } from "./Entity";
import { type Game } from "./Game";

export class Player extends Entity {
  body: Position[]; // smoothed data
  rawBody: Position[]; // raw data from server
  name: string;
  color: string;

  constructor(p: PlayerDTO, game: Game) {
    super(p.id, game);
    this.body = p.body;
    this.rawBody = p.body;
    this.name = p.name;
    this.color = p.color;
  }

  update(p: PlayerDTO) {
    this.rawBody = p.body;
    this.name = p.name;
    this.color = p.color;
  }

  draw(): void {
    const c = this.game.c;
    if (!c || this.body.length === 0) return;

    this.interpolate();

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

    c.lineWidth = 30 * this.game.camera.zoom
    c.strokeStyle = this.color;
    c.lineCap = "round";
    c.lineJoin = "round";

    c.stroke();
  }

  interpolate() {
    let { body } = this;
    const { rawBody } = this;

    // remove extra body parts
    if (body.length > rawBody.length)
      body = body.slice(0, rawBody.length);

    // add missing body parts
    if (body.length < rawBody.length)
      body = body.concat(rawBody.slice(body.length));

    if (body.length !== rawBody.length)
      throw new Error("Body length mismatch during interpolation");

    // interpolate body parts
    for (let i = 0; i < body.length; i++) {
      const bodyPart = body[i]!;
      const rawBodyPart = rawBody[i]!;

      bodyPart.x += (rawBodyPart.x - bodyPart.x) * 0.1;
      bodyPart.y += (rawBodyPart.y - bodyPart.y) * 0.1;
    }
    this.body = body;
    this.rawBody = rawBody;
  }

  getHead() {
    return this.body[0];
  }
}
