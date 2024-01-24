import { BASE_SPEED, GameMap, SPRINT_SPEED } from "@viper-vortex/shared";

export default function handleFrame(gameMap: GameMap) {
  for (let player of gameMap.players) {
    // move the player
    // start with the head
    const head = player.body[0];
    const speed = player.isSprinting ? SPRINT_SPEED : BASE_SPEED;
    head.x += Math.cos(player.angle) * speed;
    head.y += Math.sin(player.angle) * speed;

    // if the player reaches the edge of the map, slides along the edge
    if (head.x < 0) head.x = 0;
    if (head.y < 0) head.y = 0;
    if (head.x > gameMap.width) head.x = gameMap.width;
    if (head.y > gameMap.height) head.y = gameMap.height;

    // then all the other body parts follow by moving to the position of the previous body part
    for (let i = player.body.length - 1; i > 0; i--) {
      const currentPart = player.body[i];
      const previousPart = player.body[i - 1];
      currentPart.x = previousPart.x;
      currentPart.y = previousPart.y;
    }

    // check for collisions with food. Radius of 10
    const RADIUS = 20;
    for (let i = 0; i < gameMap.food.length; i++) {
      const food = gameMap.food[i];
      if (
        Math.abs(food.position.x - head.x) < RADIUS &&
        Math.abs(food.position.y - head.y) < RADIUS
      ) {
        // collision
        // remove the food
        gameMap.food.splice(i, 1);
        // add a new body part
        player.body.push({
          x: player.body[player.body.length - 1].x + 2,
          y: player.body[player.body.length - 1].y + 2,
        });
      }
    }
  }
}
