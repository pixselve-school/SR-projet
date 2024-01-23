"use client";

import { useApi } from '@/hooks/useApi';
import { Canvas } from './canvas';

export default function HomePage() {
  const api = useApi();

  return (
    <main className="flex flex-col items-center h-full justify-center">
      {!api.isConnected && <button onClick={api.connect}>Connect</button>}
      <pre>
        <code className='max-w-screen-sm overflow-auto'>
          {JSON.stringify(api.me, null, 2)}
        </code>
      </pre>
      {api.isConnected && api.scene && <Canvas />}
    </main>
  );
}
