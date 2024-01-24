import { TPS } from "@viper-vortex/shared";

const TARGET_FIXED_DELTA_TIME = 1 / TPS;
const MILLISECONDS_TO_SECONDS = 1 / 1000;

export class TimeManager {
  private startTime = performance.now();
  private lastUpdate = performance.now();
  private lastFixedUpdate = performance.now();
  private tickCount = 0;
  private fixedTickCount = 0;
  private deltaTime = 1;
  private fixedDeltaTime = 1;
  private updateCallbacks: Array<(deltaTime: number) => void> = [];
  private fixedUpdateCallbacks: Array<(deltaTime: number) => void> = [];
  isPaused = true;
  fps = 0;
  tps = 0;

  addUpdateCallback(callback: (deltaTime: number) => void) {
    this.updateCallbacks.push(callback);
  }

  addFixedUpdateCallback(callback: (deltaTime: number) => void) {
    this.fixedUpdateCallbacks.push(callback);
  }

  start() {
    this.startTime = performance.now();
    this.lastUpdate = performance.now();
    this.lastFixedUpdate = performance.now();
    this.tickCount = 0;
    this.fixedTickCount = 0;
    this.deltaTime = 1;
    this.fixedDeltaTime = 1;
    this.isPaused = false;
    this.fps = 0;
    this.tps = 0;
    requestAnimationFrame(this.update.bind(this));
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      requestAnimationFrame(this.update.bind(this));
    }
  }

  clear() {
    this.updateCallbacks = [];
    this.fixedUpdateCallbacks = [];
  }

  private update() {
    if (this.isPaused) return;

    const now = performance.now();
    this.deltaTime = (now - this.lastUpdate) * MILLISECONDS_TO_SECONDS;
    this.lastUpdate = now;
    this.tickCount++;
    this.updateCallbacks.forEach((callback) => callback(this.deltaTime));
    const rawFps = 1 / this.deltaTime;
    this.fps = 0.99 * this.fps + 0.01 * rawFps; // smooth fps

    this.fixedDeltaTime =
      (now - this.lastFixedUpdate) * MILLISECONDS_TO_SECONDS;
    if (this.fixedDeltaTime > TARGET_FIXED_DELTA_TIME) {
      const rawTps = 1 / this.fixedDeltaTime;
      this.tps = 0.9 * this.tps + 0.1 * rawTps; // smooth tps
      this.lastFixedUpdate = now;
      this.fixedTickCount++;
      this.fixedUpdateCallbacks.forEach((callback) =>
        callback(this.fixedDeltaTime),
      );
    }

    requestAnimationFrame(this.update.bind(this));
  }
}
