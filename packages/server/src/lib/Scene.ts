import {
  FIELD_OF_VIEW_RADIUS,
  FOOD_PICKUP_RADIUS,
  FoodDTO,
  MAP_HEIGHT,
  MAP_WIDTH,
  OrbDTO,
  Position,
  SceneDTO,
  SCORE_PER_FOOD,
  SCORE_PER_GAINED_ORB,
} from "@viper-vortex/shared";
import { Player } from "./Player.js";
import { v4 as uuidv4 } from "uuid";

export class Scene {
  public readonly width: number;
  public readonly height: number;
  private players: Map<string, Player> = new Map();
  private food: FoodDTO[] = [];
  private orbs: OrbDTO[] = [];

  constructor() {
    this.width = MAP_WIDTH;
    this.height = MAP_HEIGHT;
  }

  /**
   * Adds random food to the scene
   * @param number number of food to add
   */
  public addRandomFood(number: number = 1) {
    for (let i = 0; i < number; i++) {
      this.food.push({
        id: uuidv4(),
        position: {
          x: Math.floor(Math.random() * this.width),
          y: Math.floor(Math.random() * this.height),
        },
      });
    }
  }

  /**
   * Adds a player to the scene
   * @param player player to add
   */
  public addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  /**
   * Removes a player from the scene
   * @param id player id
   */
  public removePlayer(id: string) {
    this.players.delete(id);
  }

  public addOrb(position: Position, size: number) {
    this.orbs.push({
      id: uuidv4(),
      position,
      size,
    });
  }

  public update() {
    for (let player of this.playerArray) {
      player.update(this);

      // check for collisions with food. Radius of 10
      for (let i = 0; i < this.food.length; i++) {
        const food = this.food[i];
        if (
          Math.abs(food.position.x - player.head.x) < FOOD_PICKUP_RADIUS &&
          Math.abs(food.position.y - player.head.y) < FOOD_PICKUP_RADIUS
        ) {
          // collision
          // remove the food
          this.food.splice(i, 1);
          // add score
          player.score += SCORE_PER_FOOD;
        }
      }

      // check for collisions with other players
      for (let otherPlayer of this.playerArray) {
        // Skip if it's the same player
        if (player.id === otherPlayer.id) continue;

        if (player.isHeadColliding(otherPlayer)) {
          // TODO: Handle player death
          player.emitDeathAndDisconnectSocket();
        }
      }

      // Check for collisions with orbs
      for (let i = 0; i < this.orbs.length; i++) {
        const orb = this.orbs[i];
        if (
          Math.abs(orb.position.x - player.head.x) < FOOD_PICKUP_RADIUS &&
          Math.abs(orb.position.y - player.head.y) < FOOD_PICKUP_RADIUS
        ) {
          // collision
          // remove the orb
          this.orbs.splice(i, 1);
          // add score
          player.score += SCORE_PER_GAINED_ORB;
        }
      }
    }
  }

  /**
   * Returns the players in the scene
   */
  get playerArray(): Player[] {
    return Array.from(this.players.values());
  }

  get dto(): SceneDTO {
    return {
      width: this.width,
      height: this.height,
      players: this.playerArray.map((p) => p.dto),
      food: this.food,
      orbs: this.orbs,
    };
  }

  public povDto(player: Player): SceneDTO {
    // Only send what the player can see in a radius of 100
    const povPlayers = this.playerArray.filter((p) => {
      return (
        Math.abs(p.head.x - player.head.x) < FIELD_OF_VIEW_RADIUS &&
        Math.abs(p.head.y - player.head.y) < FIELD_OF_VIEW_RADIUS
      );
    });
    const povFood = this.food.filter((f) => {
      return (
        Math.abs(f.position.x - player.head.x) < FIELD_OF_VIEW_RADIUS &&
        Math.abs(f.position.y - player.head.y) < FIELD_OF_VIEW_RADIUS
      );
    });
    const povOrbs = this.orbs.filter((o) => {
      return (
        Math.abs(o.position.x - player.head.x) < FIELD_OF_VIEW_RADIUS &&
        Math.abs(o.position.y - player.head.y) < FIELD_OF_VIEW_RADIUS
      );
    });
    return {
      width: this.width,
      height: this.height,
      players: povPlayers.map((p) => p.dto),
      food: povFood,
      orbs: povOrbs,
    };
  }
}
