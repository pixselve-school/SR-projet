"use client";

import { randomUsername } from '@/utils/random';
import { useState } from 'react';

export default function HomePage() {
  const [name, setName] = useState(randomUsername());
  return (
    <main className="flex flex-col items-center h-full justify-center">
      <form className="flex flex-col gap-2 p-6 rounded-lg bg-red-100">
        <label htmlFor="username">Username</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="username" className='px-4 py-2 rounded-md' />
      </form>
    </main>
  );
}
