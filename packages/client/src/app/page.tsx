"use client";

import { randomUsername } from '@/utils/random';
import {useEffect, useRef, useState} from 'react';
import {type GameMap, SOCKET_EVENTS} from "@viper-vortex/shared";
import {socket} from "@/utils/socket";

export default function HomePage() {
  const [name, setName] = useState(randomUsername());

  const [gameMap, setGameMap] = useState<GameMap | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null)


  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  function connect() {
    socket.connect();
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFrame(gameMap: GameMap) {
      setGameMap(gameMap);
      console.log(gameMap)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(SOCKET_EVENTS.FRAME, onFrame);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(SOCKET_EVENTS.FRAME, onFrame);
    };
  }, []);

  useEffect(() => {
    // Add mousemove event listener
    const mouseMoveHandler = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', mouseMoveHandler);


    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameMap) return;


    // Draw all food
    gameMap.food.forEach(food => {
      context.beginPath();
      context.arc(food.x, food.y, 10, 0, 2 * Math.PI); // Draw a circle for each food
      // use green color
      context.fillStyle = 'green';
      context.fill();
    });

    // Draw all players
    gameMap.players.forEach(player => {
      context.beginPath();
      // for each piece of the player's body
      player.body.forEach((bodyPart) => {
        context.arc(bodyPart.x, bodyPart.y, 10, 0, 2 * Math.PI); // Draw a circle for each player
        // use the player's color
        context.fillStyle = player.color;
        context.fill();
      });
    });
  }, [gameMap]);

  useEffect(() => {
    // Get the player's head position
    const playerHead = gameMap?.players[0]?.body[0]; // Assuming the current player is the first one in the players array

    if (playerHead) {
      // Calculate the angle between the player's head and the cursor
      const angle = Math.atan2(cursorPosition.y - playerHead.y, cursorPosition.x - playerHead.x);

      // Emit a "MOVE" event every 500ms
      const intervalId = setInterval(() => {
        socket.emit(SOCKET_EVENTS.MOVE, { angle, isSprinting: false }); // Assuming the player is not sprinting
      }, 1000/60);

      // Clear the interval when the component is unmounted or the dependencies change
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [cursorPosition, gameMap]);


  return (
    <main className="flex flex-col items-center h-full justify-center">
      {/*<form className="flex flex-col gap-2 p-6 rounded-lg bg-red-100">*/}
      {/*  <label htmlFor="username">Username</label>*/}
      {/*  <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="username" className='px-4 py-2 rounded-md' />*/}
      {/*</form>*/}
      <button onClick={connect}>Connect</button>
      {isConnected && <p>Connected</p>}
      {gameMap && <canvas ref={canvasRef} id="game" width={gameMap.width} height={gameMap.height}/>}
    </main>
  );
}
