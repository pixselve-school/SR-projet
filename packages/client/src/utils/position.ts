import { type Camera } from '@/lib/Game';
import { type Position } from "@viper-vortex/shared";

export function screenToWorld(
  screenPos: Position,
  camera: Camera,
): Position {
  return {
    x: (screenPos.x - camera.offset.x) / camera.zoom,
    y: (screenPos.y - camera.offset.y) / camera.zoom,
  };
}
export function worldToScreen(
  worldPos: Position,
  camera: Camera,
): Position {
  return {
    x: worldPos.x * camera.zoom + camera.offset.x,
    y: worldPos.y * camera.zoom + camera.offset.y,
  };
}
