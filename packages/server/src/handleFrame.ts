import {
  BASE_SPEED,
  FOOD_PICKUP_RADIUS,
  GameMap,
  getPlayerHead,
  Player,
  SPRINT_SPEED,
  MAX_ANGLE,
  ORB_SPRINTING_DROP_RATE,
  SCORE_PER_ORB,
  MIN_SCORE_TO_SPRINT,
  SCORE_PER_FOOD,
  SCORE_PER_BODY_PART,
} from "@viper-vortex/shared";

function movePlayer(player: Player, gameMap: GameMap) {
  // move the player
  // start with the head

  const head = getPlayerHead(player);

  // can the player sprint?
  if (player.score < MIN_SCORE_TO_SPRINT) {
    player.isSprinting = false;
  }

  const speed = player.isSprinting ? SPRINT_SPEED : BASE_SPEED;

  if (player.isSprinting) {
    player.orbToDrop += ORB_SPRINTING_DROP_RATE;
    if (player.orbToDrop >= 1) {
      player.orbToDrop -= 1;
      // drop an orb
      const lastBodyPart = player.body[player.body.length - 1];
      gameMap.orbs.push({
        id: Math.random().toString(),
        position: { x: lastBodyPart.x, y: lastBodyPart.y },
        size: 1,
      });
      player.score -= SCORE_PER_ORB;
    }
  }

  const currentAngle = player.angle;
  const targetAngle = player.desiredAngle;

  // calculate the angle to turn
  let angleDiff = targetAngle - currentAngle;
  if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

  // limit the angle to turn
  if (angleDiff > MAX_ANGLE) angleDiff = MAX_ANGLE;
  if (angleDiff < -MAX_ANGLE) angleDiff = -MAX_ANGLE;

  // apply the angle
  player.angle += angleDiff;

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
  return head;
}

export default function handleFrame(
  gameMap: GameMap,
  onPlayerDeath: (playerId: string) => void,
) {
  for (let player of gameMap.players) {
    movePlayer(player, gameMap);

    const head = getPlayerHead(player);

    // check for collisions with food. Radius of 10
    for (let i = 0; i < gameMap.food.length; i++) {
      const food = gameMap.food[i];
      if (
        Math.abs(food.position.x - head.x) < FOOD_PICKUP_RADIUS &&
        Math.abs(food.position.y - head.y) < FOOD_PICKUP_RADIUS
      ) {
        // collision
        // remove the food
        gameMap.food.splice(i, 1);
        // add score
        player.score += SCORE_PER_FOOD;
      }
    }

    // check for collisions with other players
    // if the head of a player collides with another player's body, the player dies

    // check for collisions with other players
    for (let otherPlayer of gameMap.players) {
      // Skip if it's the same player
      if (player.id === otherPlayer.id) continue;

      for (let otherPlayerBodyPart of otherPlayer.body) {
        if (
          Math.abs(otherPlayerBodyPart.x - head.x) < FOOD_PICKUP_RADIUS &&
          Math.abs(otherPlayerBodyPart.y - head.y) < FOOD_PICKUP_RADIUS
        ) {
          // TODO: Handle player death
          onPlayerDeath(player.id);
          // Stop checking for more collisions for this player
          break;
        }
      }
    }

    // Check for collisions with orbs
    for (let i = 0; i < gameMap.orbs.length; i++) {
      const orb = gameMap.orbs[i];
      if (
        Math.abs(orb.position.x - head.x) < FOOD_PICKUP_RADIUS &&
        Math.abs(orb.position.y - head.y) < FOOD_PICKUP_RADIUS
      ) {
        // collision
        // remove the orb
        gameMap.orbs.splice(i, 1);
        // add score
        player.score += SCORE_PER_ORB;
      }
    }

    // Update the player's body based on the score
    // Minimum length of 1 (the head)
    const bodyLength = Math.max(
      1,
      Math.floor(player.score / SCORE_PER_BODY_PART),
    );

    while (player.body.length < bodyLength) {
      player.body.push({
        x: player.body[player.body.length - 1].x,
        y: player.body[player.body.length - 1].y,
      });
    }
    while (player.body.length > bodyLength) {
      player.body.pop();
    }
  }
}
