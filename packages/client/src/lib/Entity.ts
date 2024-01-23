import { type Camera } from '@/app/canvas';
import { type  Position } from '@viper-vortex/shared';

export type UpdateContext = {
  /**
   * Canvas context to draw on
   */
  c: CanvasRenderingContext2D,
  /**
   * Camera object to convert world coordinates to screen coordinates
   */
  camera: Camera
  /**
   * Screen size
   */
  screen: {
    width: number,
    height: number
  },
  /**
   * Cursor position in world coordinates
   */ 
  cursor: Position
}

export abstract class Entity {
  constructor(public id: string){}
  /**
   * Called on each animation frames
   * Used for animation or rendering 
   */
  abstract draw(props: UpdateContext) : void

  /**
   * Called on a fixed amount of times per seconds
   * Used for server communication
   * (60 by defaults)
   */
  fixedUpdate(_: UpdateContext) : void {
    // nothing by default
  }
}