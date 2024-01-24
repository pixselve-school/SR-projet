import { Game } from '@/lib/Game';
import { useEffect, useState } from 'react';

export function useGame(){
  const [game, setGame] = useState<Game | undefined>();

  useEffect(() => {
    const newGame = new Game();
    setGame(newGame);
    return () => {
      newGame.destroy();
    }
  }, []);

  return game;
}