import { type Position } from '@viper-vortex/shared';
import { useEffect, useState } from "react";

export function useMouse<T extends HTMLElement>(
  ref: React.RefObject<T> | null | undefined,
) {
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });
  useEffect(() => {
    if (!ref) return;
    const elem = ref.current;
    if (!elem) return;
    const mouseMoveHandler = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    // Handler for touch movement
    const touchMoveHandler = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        setCursorPosition({
          x: event.touches[0]!.clientX,
          y: event.touches[0]!.clientY,
        });
      }
    };
    
    elem.addEventListener("touchmove", touchMoveHandler);
    elem.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      elem.removeEventListener("touchmove", touchMoveHandler);
      elem.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [ref]);

  return cursorPosition;
}
