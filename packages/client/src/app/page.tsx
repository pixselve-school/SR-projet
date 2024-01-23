"use client";

import { useApi } from '@/hooks/useApi';
import { Canvas } from './canvas';
import { useEffect } from 'react';

export default function HomePage() {
  const api = useApi();

  useEffect(() => {
    console.log("scene (inside page)", api.scene);
  }, [api.scene]);

  return (
    <main className="flex flex-col items-center h-full justify-center">
      {!api.isConnected && <button onClick={api.connect}>Connect</button>}
      {api.isConnected && api.scene && <Canvas />}
    </main>
  );
}
