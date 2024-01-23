"use client";

import { useApi } from '@/hooks/useApi';
import { Canvas } from './canvas';

export default function HomePage() {
  const api = useApi();

  return (
    <main className="flex flex-col items-center h-full justify-center">
      {!api.isConnected && <button onClick={api.connect}>Connect</button>}
      {api.isConnected && api.scene && <Canvas />}
    </main>
  );
}
