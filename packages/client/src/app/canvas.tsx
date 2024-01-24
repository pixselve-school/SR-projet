"use client";

import { useApi } from '@/hooks/useApi';
import { useMouse } from '@/hooks/useMouse';
import { useScreen } from '@/hooks/useScreen';
import { Game, type Params } from '@/lib/Game';
import { useEffect, useRef } from 'react';

export type Camera = {
  offset: {
    x: number;
    y: number;
  };
  zoom: number;
}

const game = new Game();

export function Canvas(params: Params) {
  const api = useApi();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorScreen = useMouse(canvasRef)
  const screen = useScreen();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // esacpe
      if (e.key === 'Escape') {
        game.togglePause();
      }
      // space
      if (e.key === ' ') {
        game.setSpriniting(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      // space
      if (e.key === ' ') {
        game.setSpriniting(false);
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (e.button === 0) {
        game.setSpriniting(true);
      }
    }
    function handleMouseUp(e: MouseEvent) {
      if (e.button === 0) {
        game.setSpriniting(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, []);

  useEffect(() => {
    game.setApi(api);
  }, [api]);

  useEffect(() => {
    game.setCursor(cursorScreen);
  }, [cursorScreen]);

  useEffect(() => {
    const c = canvasRef.current?.getContext('2d');
    if (!c) return;
    game.setContext(c);
  }, []);

  useEffect(() => {
    game.updateParams(params);
  }, [params]);

  useEffect(() => {
    game.setScreenSize(screen);
  }, [screen]);

  useEffect(() => {
    if (!api.scene) return;
    game.setScene(api.scene);
  }, [api.scene]);

  return <canvas ref={canvasRef} className='w-full h-full' height={screen.height} width={screen.width} />;
}