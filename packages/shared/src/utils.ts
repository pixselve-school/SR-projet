import { PlayerDTO } from "./types";

const colors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF00FF",
  "#00FF7F",
  "#00BFFF",
  "#FFA500",
  "#800080",
  "#40E0D0",
  "#FFD700",
  "#FF7F50",
  "#FF8C69",
  "#8A2BE2",
  "#F5F5DC",
  "#808000",
  "#800000",
  "#008080",
];

export function randomDarkColor() {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export function getPlayerHead(player: PlayerDTO) {
  return player.body[0];
}

export function getPlayerRadiusFromScore(score: number) {
  const A = 1;
  const B = 10;
  return Math.sqrt((score * A) / Math.PI) + B;
}

export function getOrbSizeFromPoints(score: number) {
  const A = 0.5;
  const B = 0.5;
  return Math.sqrt((score * A) / Math.PI) + B;
}
