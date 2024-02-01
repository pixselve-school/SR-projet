"use client";

import { useMouse } from "@/hooks/useMouse";
import { useScreen } from "@/hooks/useScreen";
import { Game, type Params } from "@/lib/Game";
import { useEffect, useRef } from "react";

export function Canvas(params: Params) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorScreen = useMouse(canvasRef);
  const screen = useScreen();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // escape
      if (e.key === "Escape") {
        Game.instance?.togglePause();
      }
      // space
      if (e.key === " ") {
        Game.instance?.setSpriniting(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      // space
      if (e.key === " ") {
        Game.instance?.setSpriniting(false);
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (e.button === 0) {
        Game.instance?.setSpriniting(true);
      }
    }
    function handleMouseUp(e: MouseEvent) {
      if (e.button === 0) {
        Game.instance?.setSpriniting(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    Game.instance?.setCursor(cursorScreen);
  }, [cursorScreen]);

  useEffect(() => {
    Game.instance?.setCanvas(canvasRef.current);
    const c = canvasRef.current?.getContext("2d");
    if (!c) return;
    Game.instance?.setContext(c);
  }, []);

  useEffect(() => {
    Game.instance?.updateParams(params);
  }, [params]);

  useEffect(() => {
    Game.instance?.setScreenSize(screen);
  }, [screen]);

  return (
    <canvas
      ref={canvasRef}
      className="grid-bg h-full w-full"
      height={screen.height}
      width={screen.width}
    />
  );
}
