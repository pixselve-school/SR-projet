export type Map = {
  width: number;
  height: number;
  players: Player[];
  food: Coordinate[];
}

export type Player = {
  body: Coordinate[];
  id: string;
  name: string;
  color: string;
  isSprinting: boolean;
}

export type Coordinate = {
  x: number;
  y: number;
}

export type PlayerMove = {
  angle: number;
  isSprinting: boolean;
}

export enum SOCKET_EVENTS {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MOVE = 'move',
  FRAME = 'frame',
}
