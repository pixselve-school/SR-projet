"use client";

import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import background from "../assets/background.png";
import logo from "../assets/logo.png";
import { Canvas } from "./canvas";
import { getRandomUsername } from '@viper-vortex/shared';
export default function HomePage() {
  const [serverUrl, setServerUrl] = useState<string>("http://localhost:4000");
  const [username, setUsername] = useState("");
  const api = useApi();


  useEffect(() => {
    setUsername(getRandomUsername())
  }, [])


  if (!api.isConnected) return <Login
    setServerUrl={setServerUrl}
    serverUrl={serverUrl}
    api={api}
    setUsername={setUsername}
    username={username}
  />
  return (
    <main className="flex h-full select-none flex-col items-center justify-center">
      <div className="absolute right-0 bg-gray-400 p-4">
        <div className="font-bold">Score</div>
        <ul>
          {api.scores?.map((player) => (
            <li key={player.name + player.score}>
              {player.name}: {player.score}
            </li>
          ))}
        </ul>
      </div>
      {api.scene && <Canvas centered />}
    </main>
  );
}

function Login(props: {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  api: ReturnType<typeof useApi>;
  username: string;
  setUsername: (username: string) => void;
}) {
  return (
    <main className='flex h-full flex-col items-center relative justify-center'>
      <Image src={background} alt="Viper Vortex" layout="fill" objectFit="cover" className='fixed brightness-50 inset-0' />
      <form
        className="flex flex-col max-w-80 items-center gap-4 z-10"
        onSubmit={(e) => {
          e.preventDefault();
          props.api.connect(props.serverUrl, props.username);
        }}
      >
        <Image className="w-96" src={logo} alt="Viper Vortex"></Image>
        <h1 className="text-2xl font-bold text-white w-full">
          Viper Vortex
        </h1>
        <p className="text-white/70">
          Collect points by eating food and other players. If your head touches another player, you will explode and die.
        </p>
        <div className='relative h-14 w-full bg-white/10 backdrop-blur-md rounded-lg text-white'>
          <label
            htmlFor="username"
            className='absolute top-0 left-0 px-4 py-2 pointer-events-none text-sm text-white/50 transition-all'
          >Username</label>
          <input
            required
            id="username"
            value={props.username}
            onChange={(e) => props.setUsername(e.target.value)}
            className="px-4 pb-2 pt-6 bg-transparent w-full rounded-lg"
            type="text"
            placeholder="Your username"
          />
        </div>
        <div className='relative h-14 w-full bg-white/10 backdrop-blur-md rounded-lg text-white'>
          <label
            htmlFor="serverUrl"
            className='absolute top-0 left-0 px-4 py-2 pointer-events-none text-sm text-white/50 transition-all'
          >Server</label>
          <input
            required
            id="serverUrl"
            value={props.serverUrl}
            onChange={(e) => props.setServerUrl(e.target.value)}
            className="px-4 pb-2 pt-6 bg-transparent w-full rounded-lg"
            type="text"
            placeholder="Server URL"
          />
        </div>
        <button
          disabled={!props.username || !props.serverUrl}
          className="bg-white/30 backdrop-blur-md rounded-lg p-4 text-white w-full disabled:text-red-500 disabled:cursor-not-allowed disabled:bg-red-500/10 border-4 border-white/5 transition-all hover:bg-white/20 hover:border-white/20"
        >
          Play
        </button>
      </form>
    </main>
  );
}
