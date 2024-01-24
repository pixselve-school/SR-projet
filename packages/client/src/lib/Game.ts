import { type Camera } from "@/app/canvas";
import { screenToWorld, worldToScreen } from "@/utils/position";
import { type GameMap, type Position } from "@viper-vortex/shared";
import { type Api } from "@/hooks/useApi";
import { Orb } from "./Orb";
import { Player } from "./Player";
import { TimeManager } from "./TimeManager";
import { MyPlayer } from "./MyPlayer";

export type Params = {
  centered: boolean;
};
export class Game {
  private players: Record<string, Player> = {};
  private orbs: Record<string, Orb> = {};
  private mapSize = { width: 0, height: 0 };
  private me: MyPlayer | undefined;
  private params: Params = { centered: true };
  private api: Api | undefined;
  private time: TimeManager;
  private isSprinting = false;
  private angle = 0;
  camera: Camera = { offset: { x: 0, y: 0 }, zoom: 1 };
  cursor: Position = { x: 0, y: 0 };
  screen = { width: 0, height: 0 };
  c: CanvasRenderingContext2D | undefined;

  constructor() {
    this.time = new TimeManager();
    this.time.addUpdateCallback(this.update.bind(this));
    this.time.addFixedUpdateCallback(this.fixedUpdate.bind(this));
    this.time.start();

    console.log("Game Instance Created");
  }

  setScene(map: GameMap) {
    this.mapSize.width = map.width;
    this.mapSize.height = map.height;

    const notSeen = new Set(Object.keys(this.players));
    map.players.forEach((player) => {
      notSeen.delete(player.id);
      if (this.api?.socket?.id && player.id === this.api?.socket.id) {
        if (!this.me) this.me = new MyPlayer(player, this);
        else this.me.update(player);
        return;
      }
      if (!this.players[player.id]) {
        this.players[player.id] = new Player(player, this);
      } else {
        this.players[player.id]!.update(player);
      }
    });
    notSeen.forEach((id) => delete this.players[id]);

    const notSeenFood = new Set(Object.keys(this.orbs));
    map.food.forEach((food) => {
      notSeenFood.delete(food.id);
      if (!this.orbs[food.id]) {
        this.orbs[food.id] = new Orb(food, this);
      } else {
        this.orbs[food.id]!.update(food);
      }
    });
    notSeenFood.forEach((id) => delete this.orbs[id]);
  }

  setCursor(cursorScreen: Position) {
    this.cursor = screenToWorld(cursorScreen, this.camera);
    const playerHead = this.me?.getHead();
    if (!playerHead) return;
    this.angle = Math.atan2(
      this.cursor.y - playerHead.y,
      this.cursor.x - playerHead.x,
    );
  }

  setSpriniting(isSpriniting: boolean) {
    this.isSprinting = isSpriniting;
  }

  togglePause() {
    this.time.togglePause();
    if (this.time.isPaused) {
      // draw pause screen
      if (!this.c) return;
      this.c.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.c.fillRect(0, 0, this.screen.width, this.screen.height);
      this.c.fillStyle = "white";
      this.c.font = "50px Arial";
      this.c.textAlign = "center";
      this.c.fillText(
        "Rendering Paused",
        this.screen.width / 2,
        this.screen.height / 2,
      );
    }
  }

  updateParams(params: Partial<Params>) {
    this.params = { ...this.params, ...params };
  }

  setContext(c: CanvasRenderingContext2D) {
    this.c = c;
    this.c.imageSmoothingEnabled = false;
    // set pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = c.canvas.getBoundingClientRect();
    c.canvas.width = rect.width * dpr;
    c.canvas.height = rect.height * dpr;
    c.scale(dpr, dpr);
  }

  setApi(api: Api) {
    this.api = api;
  }

  setScreenSize(screen: { width: number; height: number }) {
    this.screen = screen;
  }

  private centerCamera() {
    const playerHead = this.me?.getHead();
    if (!playerHead) return;

    this.camera.offset = {
      x: -playerHead.x + this.screen.width / 2,
      y: -playerHead.y + this.screen.height / 2,
    };
  }

  private drawBorder() {
    const c = this.c;
    if (!c) return;
    const screenOrigin = worldToScreen({ x: 0, y: 0 }, this.camera);
    c.lineWidth = 2;
    c.fillStyle = "transparent";
    c.fillRect(0, 0, screen.width, screen.height);
    c.rect(
      screenOrigin.x,
      screenOrigin.y,
      this.mapSize.width,
      this.mapSize.height,
    );
    c.strokeStyle = "black";
    c.stroke();
  }

  update() {
    if (!this.c) return;
    this.c.clearRect(0, 0, this.screen.width, this.screen.height);

    this.drawBorder();

    if (this.params.centered) this.centerCamera();

    Object.values(this.orbs).forEach((food) => {
      food.draw();
    });
    Object.values(this.players).forEach((player) => {
      player.draw();
    });

    if (this.me) {
      this.me.draw();
    }

    // show fps top right
    this.c.fillStyle = "black";
    this.c.font = "20px Arial";
    this.c.textAlign = "right";
    this.c.fillText(
      `FPS: ${Math.round(this.time.fps).toString()}`,
      this.screen.width - 32,
      32,
    );
    this.c.fillText(
      `TPS: ${Math.round(this.time.tps).toString()}`,
      this.screen.width - 32,
      64,
    );
    this.c.fillText(
      `Sprinting: ${this.isSprinting ? "Yes" : "No"}`,
      this.screen.width - 32,
      128,
    );
  }

  fixedUpdate() {
    const api = this.api;
    if (!api) return;
    api.move({ angle: this.angle, isSprinting: this.isSprinting });
  }
}
