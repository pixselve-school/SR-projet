"use client";

import { useApi } from "@/hooks/useApi";
import { useMouse } from "@/hooks/useMouse";
import { useScreen } from "@/hooks/useScreen";
import { worldToScreen } from "@/utils/position";
import { TPS } from "@viper-vortex/shared";
import { throttle } from "lodash";
import { useEffect, useRef, useState } from "react";
export type Camera = {
  offset: {
    x: number;
    y: number;
  };
  zoom: number;
};
export function Canvas({ centered }: { centered?: boolean }) {
  const api = useApi();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState<Camera>({
    offset: { x: 0, y: 0 },
    zoom: 1,
  });
  const [curPos, curWorldPos] = useMouse(ref, camera);
  const screen = useScreen();
  const [isMouseDown, setIsMouseDown] = useState(false);

  // CENTER THE CAMERA
  useEffect(() => {
    if (!api.scene) return;
    if (!centered) {
      if (camera.offset.x === 0 && camera.offset.y === 0) return;
      setCamera((prev) => ({ ...prev, offset: { x: 50, y: 100 } }));
      return;
    }
    const playerHead = api.me?.body[0];
    if (!playerHead) return;
    const screenPlayerHead = worldToScreen(playerHead, camera);
    const newCameraOffset = {
      x: screen.width / 2 - screenPlayerHead.x,
      y: screen.height / 2 - screenPlayerHead.y,
    };
    setCamera((prev) => ({ ...prev, offset: newCameraOffset }));
  }, [api.me, api.scene, camera, centered, screen]);

  // MOVE THE PLAYER
  useEffect(() => {
    if (!api.scene || !api.me) return;

    const movePlayer = throttle(() => {
      if (!api.scene || !api.me) return;
      const playerHead = api.me.body[0];
      if (!playerHead) return;
      const angle = Math.atan2(
        curWorldPos.y - playerHead.y,
        curWorldPos.x - playerHead.x,
      );

      api.move({ angle, isSprinting: isMouseDown });
    }, 1000 / TPS);

    movePlayer();
    return () => {
      movePlayer.cancel();
    };
  }, [api, curWorldPos.x, curWorldPos.y]);

  // DRAW THE SCENE
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a circle at the cursor position
    c.beginPath();
    const screenCurPos = worldToScreen(curWorldPos, camera);
    c.arc(screenCurPos.x, screenCurPos.y, 10, 0, 2 * Math.PI);
    // use red color
    c.fillStyle = "red";
    c.strokeStyle = "red";
    c.fill();

    // Draw a line from the player's head to the cursor
    if (api.me) {
      const playerHead = api.me.body[0];
      if (playerHead) {
        const screenHead = worldToScreen(playerHead, camera);
        const screenCurPos = worldToScreen(curWorldPos, camera);
        c.beginPath();
        c.moveTo(screenHead.x, screenHead.y);
        c.lineTo(screenCurPos.x, screenCurPos.y);
        c.fillStyle = "red";
        c.strokeStyle = "red";
        c.stroke();
      }
    }

    if (!api.scene) return;

    const screenOrigin = worldToScreen({ x: 0, y: 0 }, camera);
    c.fillStyle = "transparent";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.rect(screenOrigin.x, screenOrigin.y, api.scene.width, api.scene.height);
    c.strokeStyle = "black";
    c.stroke();

    // Draw all food
    api.scene.food.forEach((food) => {
      const screenFood = worldToScreen(food.position, camera);
      c.beginPath();
      c.arc(screenFood.x, screenFood.y, 10, 0, 2 * Math.PI); // Draw a circle for each food
      // use green color
      c.fillStyle = "green";
      c.fill();
    });

    // Draw all orbs
    api.scene.orbs.forEach((orb) => {
      const screenOrb = worldToScreen(orb.position, camera);
      c.beginPath();
      c.arc(screenOrb.x, screenOrb.y, 5 * orb.size, 0, 2 * Math.PI); // Draw a circle for each orb
      // use blue color
      c.fillStyle = "blue";
      c.fill();
    });

    // Draw all players
    api.scene.players.forEach((player) => {
      player.body.forEach((bodyPart) => {
        const screenBodyPart = worldToScreen(bodyPart, camera);
        c.beginPath();
        c.arc(screenBodyPart.x, screenBodyPart.y, 10, 0, 2 * Math.PI);
        c.fillStyle = player.color;
        c.fill();
        c.strokeStyle = player.color;
        c.stroke();
      });
    });
  }, [
    api,
    api.scene,
    camera,
    camera.offset.x,
    camera.offset.y,
    curPos,
    curWorldPos,
    curWorldPos.x,
    curWorldPos.y,
  ]);

  if (!api.scene) return "Scene not found";

  return (
    <canvas
      onMouseUp={() => setIsMouseDown(false)}
      onMouseDown={() => setIsMouseDown(true)}
      ref={ref}
      className="h-full w-full"
      height={screen.height}
      width={screen.width}
    />
  );
}
