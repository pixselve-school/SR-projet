"use client";

import { useApi } from '@/hooks/useApi';
import { useMouse } from '@/hooks/useMouse';
import { useScreen } from '@/hooks/useScreen';
import { Game } from '@/lib/Game';
import { useEffect, useRef } from 'react';

export type Camera = {
  offset: {
    x: number;
    y: number;
  };
  zoom: number;
}

export function Canvas({ centered }: { centered?: boolean }) {
  const api = useApi();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const cursorScreen = useMouse(canvasRef)
  const screen = useScreen();

  useEffect(() => {
    const c = canvasRef.current?.getContext('2d');
    const scene = api.scene;
    if (!c || !scene) return;
    if (!canvasRef.current) 
      gameRef.current = new Game(scene);
    const game = gameRef.current;
    if (!game) return;
  }, [api.scene, cursorScreen, screen]);

  return <canvas ref={canvasRef} className='w-full h-full' height={screen.height} width={screen.width} />;
}