"use client";

import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import background from "../assets/background.png";
import logo from "../assets/logo.png";
import { Canvas } from "./canvas";
import { getRandomUsername } from "@viper-vortex/shared";
export default function HomePage() {
  const [serverUrl, setServerUrl] = useState<string>("http://localhost:4000");
  const [username, setUsername] = useState("");
  const api = useApi();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      setServerUrl("sr.mael.app");
    }
  }, []);

  useEffect(() => {
    setUsername(getRandomUsername());
  }, []);

  if (!api.isConnected)
    return (
      <Login
        setServerUrl={setServerUrl}
        serverUrl={serverUrl}
        api={api}
        setUsername={setUsername}
        username={username}
      />
    );
  return (
    <main className="flex h-full select-none flex-col items-center justify-center">
      <div className="pointer-events-none absolute right-0 top-0 m-4 flex flex-col gap-2 rounded-lg bg-white/10 p-4 text-white backdrop-blur-md">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <div className="flex w-80 flex-col gap-2">
          {api.scores?.slice(0, 5).map((player) => (
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
          {(api.scores?.length ?? 0) > 5 && (
            <span className="opacity-40">
              ... {api.scores?.length ?? 0 - 5} more players
            </span>
          )}
        </div>
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
    <main className="relative flex h-full flex-col items-center justify-center">
      <Image
        src={background}
        alt="Viper Vortex"
        layout="fill"
        objectFit="cover"
        className="fixed inset-0 brightness-50"
      />
      <form
        className="z-10 flex max-w-80 flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          props.api.connect(props.serverUrl, props.username);
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
            value={props.username}
            onChange={(e) => props.setUsername(e.target.value)}
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
            value={props.serverUrl}
            onChange={(e) => props.setServerUrl(e.target.value)}
            className="w-full rounded-lg bg-transparent px-4 pb-2 pt-6"
            type="text"
            placeholder="Server URL"
          />
        </div>
        <button
          disabled={!props.username || !props.serverUrl}
          className="w-full rounded-lg border-4 border-white/5 bg-white/30 p-4 text-white backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/20 disabled:cursor-not-allowed disabled:bg-red-500/10 disabled:text-red-500"
        >
          Play
        </button>
      </form>
      <a
        href="https://github.com/pixselve-school/SR-projet"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-0 top-0 m-8 text-zinc-500 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
          ></path>
        </svg>
      </a>
    </main>
  );
}
