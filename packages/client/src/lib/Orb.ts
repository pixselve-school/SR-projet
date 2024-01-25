import { worldToScreen } from "@/utils/position";
import { type OrbDTO } from "@viper-vortex/shared";
import { Food } from "./Food";
import { type Game } from "./Game";

export class Orb extends Food {
  private size: number;
  constructor(orb: OrbDTO, game: Game) {
    super(orb, game);
    this.size = orb.size;
  }

  update(orb: OrbDTO) {
    super.update(orb);
    this.size = orb.size;
  }

  draw(): void {
    const c = this.game.c;
    if (!c) return;
    const screenFood = worldToScreen(this.position, this.game.camera);
    c.beginPath();
    c.arc(screenFood.x, screenFood.y, this.size * 5 * this.game.camera.zoom, 0, 2 * Math.PI);
    c.fillStyle = "lightblue";
    c.fill();
  }
}
