import { worldToScreen } from "@/utils/position";
import {
  getPlayerRadiusFromScore,
  type PlayerDTO,
  type Position,
} from "@viper-vortex/shared";
import { Entity } from "./Entity";
import { type Game } from "./Game";

export class Player extends Entity {
  body: Position[]; // smoothed data
  rawBody: Position[]; // raw data from server
  name: string;
  color: string;
  score: number;

  constructor(p: PlayerDTO, game: Game) {
    super(p.id, game);
    this.body = p.body;
    this.rawBody = p.body;
    this.name = p.name;
    this.color = p.color;
    this.score = p.score;
  }

  update(p: PlayerDTO) {
    this.rawBody = p.body;
    this.name = p.name;
    this.color = p.color;
    this.score = p.score;
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

    c.lineWidth = getPlayerRadiusFromScore(this.score) * this.game.camera.zoom;
    c.strokeStyle = this.color;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.globalAlpha = 1;
    // add an outline if sprinting
    if (this.game.isSprinting) {
      c.shadowBlur = 10;
      // change alpha based on time
      const t = this.game.time.fixedTickCount;
      c.shadowColor = `rgba(255, 255, 255, ${Math.sin(t / 2) * 0.4 + 0.6})`;
    }
    c.stroke();
    c.shadowBlur = 0;

    // draw names
    const head = this.getHead();
    if (!head) return;
    const screenHead = worldToScreen(head, this.game.camera);
    c.font = "20px Arial";
    c.fillStyle = "hsla(0, 10%, 74%, 0.753)";
    c.textAlign = "center";
    c.fillText(this.name, screenHead.x, screenHead.y - 40);

    // draw eyes
    const eyeRadius =
      (getPlayerRadiusFromScore(this.score) * this.game.camera.zoom) / 5; // adjust eye size as needed
    const eyeDistance =
      (getPlayerRadiusFromScore(this.score) * this.game.camera.zoom) / 10; // adjust eye distance as needed
    c.fillStyle = "white"; // eye color
    c.beginPath();
    c.arc(
      screenHead.x - eyeDistance,
      screenHead.y - eyeDistance,
      eyeRadius,
      0,
      2 * Math.PI,
    );
    c.arc(
      screenHead.x + eyeDistance,
      screenHead.y - eyeDistance,
      eyeRadius,
      0,
      2 * Math.PI,
    );
    c.fill();

    // draw pupils
    const pupilRadius = eyeRadius / 2; // adjust pupil size as needed
    c.fillStyle = "black"; // pupil color
    c.beginPath();
    c.arc(
      screenHead.x - eyeDistance,
      screenHead.y - eyeDistance,
      pupilRadius,
      0,
      2 * Math.PI,
    );
    c.arc(
      screenHead.x + eyeDistance,
      screenHead.y - eyeDistance,
      pupilRadius,
      0,
      2 * Math.PI,
    );
    c.fill();
  }

  interpolate() {
    let { body } = this;
    const { rawBody } = this;

    // remove extra body parts
    if (body.length > rawBody.length) body = body.slice(0, rawBody.length);

    // add missing body parts
    if (body.length < rawBody.length)
      body = body.concat(rawBody.slice(body.length));

    if (body.length !== rawBody.length)
      throw new Error("Body length mismatch during interpolation");

    // interpolate body parts
    for (let i = 0; i < body.length; i++) {
      const bodyPart = body[i]!;
      const rawBodyPart = rawBody[i]!;

      bodyPart.x += (rawBodyPart.x - bodyPart.x) * 0.2;
      bodyPart.y += (rawBodyPart.y - bodyPart.y) * 0.2;
    }
    this.body = body;
    this.rawBody = rawBody;
  }

  getHead() {
    return this.body[0];
  }
}
