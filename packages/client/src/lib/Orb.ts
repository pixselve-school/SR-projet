import { worldToScreen } from "@/utils/position";
import { getOrbSizeFromPoints, type OrbDTO, type Position } from "@viper-vortex/shared";
import { Entity } from './Entity';
import { type Game } from "./Game";

export class Orb extends Entity{
  private size: number;
  private points: number;
  private readonly color: string;
  private position: Position;
  
  constructor(orb: OrbDTO, game: Game) {
    super(orb.id, game);
    this.points = orb.points;
    this.size = getOrbSizeFromPoints(orb.points);
    this.color = orb.color;
    this.position = orb.position;
  }

  update(orb: OrbDTO) {
    this.position = orb.position;
    this.points = orb.points;
    this.size = getOrbSizeFromPoints(orb.points);
  }

  draw(): void {
    const c = this.game.c;
    if (!c) return;
    const screenPos = worldToScreen(this.position, this.game.camera);
    c.beginPath();
    c.arc(
      screenPos.x,
      screenPos.y,
      this.size * 5 * this.game.camera.zoom,
      0,
      2 * Math.PI,
    );
    c.fillStyle = this.color;
    // lower opacity 
    c.globalAlpha = 0.4;
    c.lineWidth = 0;
    c.shadowBlur = 6;
    c.shadowColor = "rgba(255, 255, 255, 0.4)";
    c.fill();
    c.shadowBlur = 0;
    c.globalAlpha = 1;
  }
}
