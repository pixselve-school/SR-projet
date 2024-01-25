import { screenToWorld, worldToScreen } from "@/utils/position";
import { type SceneDTO, type Position } from "@viper-vortex/shared";
import { type Api } from "@/hooks/useApi";
import { Food } from "./Food";
import { Player } from "./Player";
import { TimeManager } from "./TimeManager";
import { MyPlayer } from "./MyPlayer";
import { Orb } from "./Orb";

export type Params = {
  centered: boolean;
};

export type Camera = {
  offset: {
    x: number;
    y: number;
  };
  zoom: number;
};

export class Game {
  private players: Record<string, Player> = {};
  private foods: Record<string, Food> = {};
  private orbs: Record<string, Food> = {};
  private mapSize = { width: 0, height: 0 };
  private me: MyPlayer | undefined;
  private params: Params = { centered: true };
  private api: Api | undefined;
  private time: TimeManager;
  private isSprinting = false;
  private angle = 0;
  private canvas: HTMLCanvasElement | null = null;
  camera: Camera = { offset: { x: 0, y: 0 }, zoom: 2 };
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

  destroy() {
    console.log("Game Instance Destroyed");
  }

  setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
  }

  setScene(scene: SceneDTO) {
    this.mapSize.width = scene.width;
    this.mapSize.height = scene.height;

    const notSeen = new Set(Object.keys(this.players));
    scene.players.forEach((player) => {
      notSeen.delete(player.id); // seen
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

    const notSeenFood = new Set(Object.keys(this.foods));
    scene.food.forEach((food) => {
      notSeenFood.delete(food.id); // seen
      if (!this.foods[food.id]) {
        this.foods[food.id] = new Food(food, this);
      } else {
        this.foods[food.id]!.update(food);
      }
    });
    notSeenFood.forEach((id) => delete this.foods[id]);

    const notSeenOrbs = new Set(Object.keys(this.orbs));
    scene.orbs.forEach((orb) => {
      notSeenOrbs.delete(orb.id); // seen
      if (!this.orbs[orb.id]) {
        this.orbs[orb.id] = new Orb(orb, this);
      } else {
        this.orbs[orb.id]!.update(orb);
      }
    });
    notSeenOrbs.forEach((id) => delete this.orbs[id]);
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
      x: -playerHead.x * this.camera.zoom + this.screen.width / 2,
      y: -playerHead.y * this.camera.zoom + this.screen.height / 2,
    };

    // offset the background
    this.canvas?.style.setProperty(
      "--background-offset-x",
      `${this.camera.offset.x}px`,
    );
    this.canvas?.style.setProperty(
      "--background-offset-y",
      `${this.camera.offset.y}px`,
    );
  }

  private drawBorder() {
    const c = this.c;
    if (!c) return;
    const screenOrigin = worldToScreen({ x: 0, y: 0 }, this.camera);
    c.lineWidth = 2;
    c.fillStyle = "transparent";
    c.rect(
      screenOrigin.x,
      screenOrigin.y,
      this.mapSize.width * this.camera.zoom,
      this.mapSize.height * this.camera.zoom,
    );
    c.strokeStyle = "black";
    c.stroke();
  }

  update() {
    if (!this.c) return;
    this.c.clearRect(0, 0, this.screen.width, this.screen.height);

    this.drawBorder();

    if (this.params.centered) this.centerCamera();

    Object.values(this.foods).forEach((food) => {
      food.draw();
    });
    Object.values(this.players).forEach((player) => {
      player.draw();
    });

    if (this.me) {
      this.me.draw();
    }
    Object.values(this.orbs).forEach((orb) => {
      orb.draw();
    });

    // show fps top right
    this.c.fillStyle = "white";
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
