"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import background from "../assets/background.png";
import logo from "../assets/logo.png";
import { Canvas } from "./canvas";
import { getRandomUsername } from "@viper-vortex/shared";
import { useSignals } from "@preact/signals-react/runtime";
import { connect, disconnect, isConnected, scores } from "@/lib/socket";

export default function HomePage() {
  useSignals();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  if (!isConnected.value) return <Login />;
  return (
    <main className="flex h-full select-none flex-col items-center justify-center">
      <Scoreboard />
      <Canvas centered />
    </main>
  );
}

function Scoreboard() {
  useSignals();
  return (
    <div className="pointer-events-none absolute right-0 top-0 m-4 flex flex-col gap-2 rounded-lg bg-white/10 p-4 text-white backdrop-blur-md">
      <h2 className="text-xl font-bold">Leaderboard</h2>
      <div className="flex w-80 flex-col gap-2">
        {scores.value.map((player) => (
          <div
            key={player.name}
            className="flex justify-between gap-8 text-white/70"
          >
            <div className="flex max-w-60 justify-between">
              <span className="truncate">{player.name}</span>
            </div>
            <div className="flex max-w-20 justify-between truncate font-bold">
              {Math.round(player.score)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Login() {
  const [serverUrl, setServerUrl] = useState<string>("http://localhost:4000");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      setServerUrl("sr.mael.app");
    }
  }, []);

  useEffect(() => {
    setUsername(getRandomUsername());
  }, []);

  return (
    <main className="relative flex h-full flex-col items-center justify-center">
      <Image
        src={background}
        alt="Viper Vortex"
        fill
        className="fixed inset-0 object-cover brightness-50"
      />
      <form
        className="z-10 flex max-w-80 flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          connect(serverUrl, username);
        }}
      >
        <Image className="w-96" src={logo} alt="Viper Vortex"></Image>
        <h1 className="w-full text-2xl font-bold text-white">Viper Vortex</h1>
        <p className="text-white/70">
          Collect points by eating food and other players. If your head touches
          another player, you will explode and die.
        </p>
        <div className="relative h-14 w-full rounded-lg bg-white/10 text-white backdrop-blur-md">
          <label
            htmlFor="username"
            className="pointer-events-none absolute left-0 top-0 px-4 py-2 text-sm text-white/50 transition-all"
          >
            Username
          </label>
          <input
            required
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg bg-transparent px-4 pb-2 pt-6"
            type="text"
            placeholder="Your username"
          />
        </div>
        <div className="relative h-14 w-full rounded-lg bg-white/10 text-white backdrop-blur-md">
          <label
            htmlFor="serverUrl"
            className="pointer-events-none absolute left-0 top-0 px-4 py-2 text-sm text-white/50 transition-all"
          >
            Server
          </label>
          <input
            required
            id="serverUrl"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            className="w-full rounded-lg bg-transparent px-4 pb-2 pt-6"
            type="text"
            placeholder="Server URL"
          />
        </div>
        <button
          disabled={!username || !serverUrl}
          className="w-full rounded-lg border-4 border-white/5 bg-white/30 p-4 text-white backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/20 disabled:cursor-not-allowed disabled:bg-red-500/10 disabled:text-red-500"
        >
          Play
        </button>
      </form>
    </main>
  );
}
