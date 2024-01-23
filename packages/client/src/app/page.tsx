"use client";

import { useApi } from '@/hooks/useApi';
import { Canvas } from './canvas';
import { useState } from 'react';

export default function HomePage() {
  const [serverUrl, setServerUrl] = useState<string>('http://localhost:4000');
  const api = useApi(serverUrl);
  const [isCentered, setIsCentered] = useState<boolean>(true);

  return (
    <main className="flex flex-col items-center h-full justify-center">
      <div className='absolute top-4 left-4 flex-col flex gap-2'>
        <label htmlFor="serverUrl">server url</label>
        <input type="text" id="serverUrl" placeholder='server url here' value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
      </div>
      <div className='absolute bottom-4 left-4 items-center flex gap-2'>
        <input type="checkbox" id="centered" className='h-6 w-6' checked={isCentered} onChange={(e) => setIsCentered(e.target.checked)} />
        <label htmlFor="centered">centered</label>
      </div>
      {!api.isConnected && <button onClick={api.connect}>Connect</button>}
      {api.isConnected && api.scene && <Canvas centered={isCentered} />}
    </main>
  );
}
