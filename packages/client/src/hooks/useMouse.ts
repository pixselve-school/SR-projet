import { useEffect, useState } from "react";

export function useMouse<T extends HTMLElement>(ref: React.RefObject<T> | null | undefined) {
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
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
  }, [ref]);
  return cursorPosition;
}
