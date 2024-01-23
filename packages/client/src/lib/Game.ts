import { Camera } from "@/app/canvas";
import { screenToWorld, worldToScreen } from "@/utils/position";
import { GameMap, Position } from "@viper-vortex/shared";
import { type UpdateContext } from "./Entity";
import { Food } from "./Food";
import { Player } from "./Player";
const ME_ID = "me";
export class Game {
  private players: Record<string, Player> = {};
  private food: Record<string, Food> = {};
  private width = 0;
  private height = 0;
  private camera: Camera = { offset: { x: 0, y: 0 }, zoom: 1 };
  private me: Player | undefined;
  private cursor: Position = { x: 0, y: 0 };
  private screen: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  private centered = true;
  private c : CanvasRenderingContext2D | undefined;
  

  setScene(map: GameMap) {
    this.width = map.width;
    this.height = map.height;

    const notSeen = new Set(Object.keys(this.players))
    map.players.forEach((player) => {
      notSeen.delete(player.id);
      if (player.id === ME_ID) {
        if (!this.me) this.me = new Player(player);
        else this.me.update(player);
        return;
      }
      if (!this.players[player.id]) {
        this.players[player.id] = new Player(player);
      } else {
        this.players[player.id]!.update(player);
      }
    });
    notSeen.forEach((id) => delete this.players[id]);

    const notSeenFood = new Set(Object.keys(this.food));
    map.food.forEach((food) => {
      notSeenFood.delete(food.id);
      if (!this.food[food.id]) {
        this.food[food.id] = new Food(food);
      } else {
        this.food[food.id]!.update(food);
      }
    });
    notSeenFood.forEach((id) => delete this.food[id]);
  }

  update() {
    if (!this.c) return
    this.c.clearRect(0, 0, this.screen.width, this.screen.height);

    this.drawBorder(context);

    if (this.centered) this.centerCamera();

    Object.values(this.food).forEach((food) => {
      food.draw(context);
    });
    Object.values(this.players).forEach((player) => {
      player.draw(context);
    });

    if (this.me) {
      this.me.draw(context);
    }
  }

  setCursor(cursorScreen: Position) {
    this.cursor = screenToWorld(cursorScreen, this.camera);
  }

  setScreenSize(screen: { width: number; height: number }) {
    this.screen = screen;
  }


  private centerCamera() {
    const playerHead = this.me?.getHead();
    if (!playerHead) return;
    const screenPlayerHead = worldToScreen(playerHead, this.camera);
    const newCameraOffset = {
      x: screen.width / 2 - screenPlayerHead.x,
      y: screen.height / 2 - screenPlayerHead.y,
    };
    this.camera.offset = newCameraOffset;
  }

  private drawBorder() {
    const c = this.c;
    if (!c) return;
    const screenOrigin = worldToScreen({ x: 0, y: 0 }, this.camera);
    c.fillStyle = "transparent";
    c.fillRect(0, 0, screen.width, screen.height);
    c.rect(screenOrigin.x, screenOrigin.y, this.width, this.height);
    c.strokeStyle = "black";
    c.stroke();
  }

  fixedUpdate({ cursor }: UpdateContext) {
    const playerHead = this.me?.getHead();
    if (!playerHead) return;
    const angle = Math.atan2(cursor.y - playerHead.y, cursor.x - playerHead.x);
    // api.move({ angle, isSprinting: false });
  }
}
