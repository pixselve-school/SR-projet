"use client";

import { useApi } from "@/hooks/useApi";
import { Canvas } from "./canvas";
import { SVGProps, useState } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";

export default function HomePage() {
  const [serverUrl, setServerUrl] = useState<string>("http://localhost:4000");
  const api = useApi(serverUrl);
  const [isCentered, setIsCentered] = useState<boolean>(false);
  const [username, setUsername] = useState("");

  return (
    <main className="dustBackground flex h-full flex-col items-center justify-center">
      {!api.isConnected && (
        <LoginComponent
          setServerUrl={setServerUrl}
          serverUrl={serverUrl}
          api={api}
          setUsername={setUsername}
          username={username}
        ></LoginComponent>
      )}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="centered"
          className="h-6 w-6"
          checked={isCentered}
          onChange={(e) => setIsCentered(e.target.checked)}
        />
        <label htmlFor="centered">centered</label>
      </div>

      <div className="absolute right-0 top-0 bg-gray-400 p-4">
        <div className="font-bold">Score</div>
        <ul>
          {api.scene?.players.map((player) => (
            <li key={player.id}>
              {player.name}: {player.score}
            </li>
          ))}
        </ul>
      </div>
      {api.isConnected && api.scene && <Canvas centered={isCentered} />}
    </main>
  );
}

function LoginComponent(props: {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  api: ReturnType<typeof useApi>;
  username: string;
  setUsername: (username: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <Image className="w-1/2" src={logo} alt="Viper Vortex"></Image>

      <h1 className="text-xl font-bold text-red-500">
        Play together with your friends
      </h1>

      <input
        onChange={(e) => props.setUsername(e.target.value)}
        value={props.username}
        required
        className="w-full rounded-full border-2 border-gray-500 bg-gray-200 py-2 text-center text-black"
        type="text"
        placeholder="Name"
      />

      <input
        value={props.serverUrl}
        onChange={(e) => props.setServerUrl(e.target.value)}
        className="w-full rounded-full border-2 border-gray-500 bg-gray-200 py-2 text-center text-black"
        type="text"
        placeholder="Server URL"
      />

      <button
        onClick={props.api.connect}
        disabled={!props.username || !props.serverUrl}
        className="w-full rounded-full bg-red-500 py-2 text-2xl font-bold ring-4 ring-red-500/50 ring-offset-8 ring-offset-red-950 transition-transform hover:scale-105 disabled:bg-gray-500 disabled:ring-gray-500/50"
      >
        Play
      </button>
    </div>
  );
}
