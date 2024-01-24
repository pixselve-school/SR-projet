import { type Game } from './Game';

export abstract class Entity {
  constructor(public id: string, protected game: Game){}
  /**
   * Called on each animation frames
   * Used for animation or rendering 
   */
  abstract draw() : void

  /**
   * Called on a fixed amount of times per seconds
   * Used for server communication
   * (60 by defaults)
   */
  fixedUpdate() : void {
    // nothing by default
  }
}