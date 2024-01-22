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
