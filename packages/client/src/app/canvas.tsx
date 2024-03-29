"use client";

import { useApi } from "@/hooks/useApi";
import { useGame } from "@/hooks/useGame";
import { useMouse } from "@/hooks/useMouse";
import { useScreen } from "@/hooks/useScreen";
import { type Params } from "@/lib/Game";
import { useEffect, useRef } from "react";

export function Canvas(params: Params) {
  const api = useApi();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorScreen = useMouse(canvasRef);
  const screen = useScreen();
  const game = useGame();
  useEffect(() => {
    if (!game) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (!game) return;
      // esacpe
      if (e.key === "Escape") {
        game.togglePause();
      }
      // space
      if (e.key === " ") {
        game.setSpriniting(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (!game) return;
      // space
      if (e.key === " ") {
        game.setSpriniting(false);
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (!game) return;
      if (e.button === 0) {
        game.setSpriniting(true);
      }
    }
    function handleMouseUp(e: MouseEvent) {
      if (!game) return;
      if (e.button === 0) {
        game.setSpriniting(false);
      }
    }
    function handleTouchStart(e: TouchEvent) {
      if (!game) return;
      // if 2 or more touches, sprint
      if (e.touches.length > 1) {
        game.setSpriniting(true);
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!game) return;
      if (e.touches.length <= 1) {
        game.setSpriniting(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [game]);

  useEffect(() => {
    if (!game) return;
    game.setApi(api);
  }, [api, game]);

  useEffect(() => {
    if (!game) return;
    game.setCursor(cursorScreen);
  }, [cursorScreen, game]);

  useEffect(() => {
    if (!game) return;
    game.setCanvas(canvasRef.current);
    const c = canvasRef.current?.getContext("2d");
    if (!c) return;
    game.setContext(c);
  }, [game]);

  useEffect(() => {
    if (!game) return;
    game.updateParams(params);
  }, [game, params]);

  useEffect(() => {
    if (!game) return;
    game.setScreenSize(screen);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = screen.width;
    canvas.height = screen.height;
  }, [game, screen]);

  useEffect(() => {
    if (!game) return;
    if (!api.scene) return;
    game.setScene(api.scene);
  }, [api.scene, game]);

  useEffect(() => {
    if (!game) return;
    game.setOrbs(api.orbs);
  }, [api.orbs, game]);

  return (
    <canvas
      ref={canvasRef}
      className="grid-bg h-full w-full"
    />
  );
}
