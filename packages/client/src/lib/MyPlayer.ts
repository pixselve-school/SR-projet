import { worldToScreen } from "@/utils/position";
import { Player } from "./Player";

export class MyPlayer extends Player {
  draw(): void {
    super.draw();
    // const c = this.game.c;
    // if (!c) return;
    // // const playerHead = this.getHead();
    // // if (playerHead) {
    // //   const screenHead = worldToScreen(playerHead, this.game.camera);
    // //   const screenCurPos = worldToScreen(this.game.cursor, this.game.camera);
    // //   c.beginPath();
    // //   c.moveTo(screenHead.x, screenHead.y);
    // //   c.lineTo(screenCurPos.x, screenCurPos.y);
    // //   c.fillStyle = "red";
    // //   c.strokeStyle = "red";
    // //   c.lineWidth = 2;
    // //   c.stroke();
    // // }
  }
}
