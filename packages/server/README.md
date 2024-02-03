# @viper-vortex/server

This package is the server-side component of the Viper Vortex project. It handles player connections, game logic, and communication with the client-side component.

## Installation

You can install this package by cloning the repository and running the following command in the `packages/server` directory:

```bash
npm install
```

## Usage

To start the server, use the following command:

```bash
npm run start
```

## Docker Image

A Docker image for the server is available at `ghcr.io/pixselve-school/sr-projet/server:main`. You can pull and run the Docker image with the following commands:

```bash
docker pull ghcr.io/pixselve-school/sr-projet/server:main
docker run -p 4000:4000 ghcr.io/pixselve-school/sr-projet/server:main
```

The server will be available at `http://localhost:4000`.

## Protocol

The server uses the Socket.IO library for real-time, bidirectional and event-based communication. The protocol is defined in the `@viper-vortex/shared` package and includes the following events:

- `SOCKET_EVENTS.CONNECT`: Triggered when a new client connects to the server.
- `SOCKET_EVENTS.JOIN`: Triggered when a client joins the game. The client sends their player name with this event.
- `SOCKET_EVENTS.DISCONNECT`: Triggered when a client disconnects from the server.
- `SOCKET_EVENTS.MOVE`: Triggered when a client sends a move command. The client sends the direction and speed of the move with this event.
- `SOCKET_EVENTS.FRAME`: Triggered by the server to send game state updates to the clients.
- `SOCKET_EVENTS.ORBS`: Triggered by the server to send orb updates to the clients.
- `SOCKET_EVENTS.SCORES`: Triggered by the server to send score updates to the clients.

For more details on the protocol, please refer to the `@viper-vortex/shared` package.
