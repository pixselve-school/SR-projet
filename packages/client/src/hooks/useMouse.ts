import { type Camera } from "@/app/canvas";
import { screenToWorld } from "@/utils/position";
import { type Position } from '@viper-vortex/shared';
import { useEffect, useMemo, useState } from "react";

export function useMouse<T extends HTMLElement>(
  ref: React.RefObject<T> | null | undefined,
  camera: Camera,
) {
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });
  useEffect(() => {
    if (!ref) return;
    const elem = ref.current;
    if (!elem) return;
    const mouseMoveHandler = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };
    elem.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      elem.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [camera.offset.x, camera.offset.y, ref]);

  const cursorWorldPosition = useMemo(() => {
    return screenToWorld(cursorPosition, camera);
  }, [camera, cursorPosition]);

  return [cursorPosition, cursorWorldPosition] as const;
}
