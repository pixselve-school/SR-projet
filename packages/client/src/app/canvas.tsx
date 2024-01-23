"use client";

import { useApi } from '@/hooks/useApi';
import { useMouse } from '@/hooks/useMouse';
import { useScreen } from '@/hooks/useScreen';
import { TPS } from '@viper-vortex/shared';
import { useEffect, useRef } from 'react';

export function Canvas() {
  const api = useApi();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const curPos = useMouse(ref)
  const { width, height } = useScreen();

  // MOVE THE PLAYER
  useEffect(() => {
    // Get the player's head position
    if (!api.scene || !api.me) return;
    const playerHead = api.me.body[0];
    if (!playerHead) return;
    const angle = Math.atan2(curPos.y - playerHead.y, curPos.x - playerHead.x);
    const intervalId = setInterval(() => {
      api.move({ angle, isSprinting: false });
    }, 1000 / TPS);

    return () => {
      clearInterval(intervalId);
    };
  }, [api, curPos]);

  useEffect(() => {
    console.log("scene in canvas", api.scene);
  }, [api.scene]);

  // DRAW THE SCENE
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;

    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a circle at the cursor position
    c.beginPath();
    c.arc(curPos.x, curPos.y, 10, 0, 2 * Math.PI);
    // use red color
    c.fillStyle = 'red';
    c.fill();

    if (!api.scene)
      return


    // Draw all food
    api.scene.food.forEach(food => {
      c.beginPath();
      c.arc(food.x, food.y, 10, 0, 2 * Math.PI); // Draw a circle for each food
      // use green color
      c.fillStyle = 'green';
      c.fill();
    });

    // Draw all players
    api.scene.players.forEach(player => {
      c.beginPath();
      // for each piece of the player's body
      player.body.forEach((bodyPart) => {
        c.arc(bodyPart.x, bodyPart.y, 10, 0, 2 * Math.PI); // Draw a circle for each player
        // use the player's color
        c.fillStyle = player.color;
        c.fill();
      });
    });
  }, [api, api.scene, curPos]);

  if (!api.scene) return "Scene not found";

  return <canvas ref={ref} className='w-full cursor-none h-full' height={height} width={width} />;
}