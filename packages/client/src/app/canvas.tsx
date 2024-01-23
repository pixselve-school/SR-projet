"use client";

import { useApi } from '@/hooks/useApi';
import { useMouse } from '@/hooks/useMouse';
import { useScreen } from '@/hooks/useScreen';
import { TPS } from '@viper-vortex/shared';
import { throttle } from 'lodash';
import { useEffect, useRef, useState } from 'react';
export type Camera = {
  offset: {
    x: number;
    y: number;
  };
  zoom: number;
}
export function Canvas({ centered }: { centered?: boolean }) {
  const api = useApi();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState<Camera>({ offset: { x: 0, y: 0 }, zoom: 1 });
  const curPos = useMouse(ref)
  const { width, height } = useScreen();

  // MOVE THE PLAYER
  useEffect(() => {
    if (!api.scene || !api.me) return;

    const movePlayer = throttle(() => {
      if (!api.scene || !api.me) return;
      const playerHead = api.me.body[0];
      if (!playerHead) return;
      const angle = Math.atan2(curPos.y - playerHead.y, curPos.x - playerHead.x);
      api.move({ angle, isSprinting: false });
    }, 1000 / TPS);

    movePlayer();
    return () => {
      movePlayer.cancel();
    };
  }, [api, curPos.x, curPos.y]);


  // DRAW THE SCENE
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a circle at the cursor position
    c.beginPath();
    c.arc(curPos.x, curPos.y, 10, 0, 2 * Math.PI);
    // use red color
    c.fillStyle = 'red';
    c.fill();

    // Draw a line from the player's head to the cursor
    if (api.me) {
      const playerHead = api.me.body[0];
      if (playerHead) {
        c.beginPath();
        c.moveTo(playerHead.x, playerHead.y);
        c.lineTo(curPos.x, curPos.y);
        c.strokeStyle = 'red';
        c.stroke();
      }
    }

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
      player.body.forEach((bodyPart) => {
        c.beginPath();
        c.arc(bodyPart.x, bodyPart.y, 10, 0, 2 * Math.PI);
        c.fillStyle = player.color;
        c.fill();
        c.strokeStyle = player.color;
        c.stroke();
      });
    });
  }, [api, api.scene, curPos]);

  if (!api.scene) return "Scene not found";

  return <canvas ref={ref} className='w-full cursor-none h-full' height={height} width={width} />;
}