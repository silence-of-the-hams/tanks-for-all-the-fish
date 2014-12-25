function startGame(width, height, tanks) {
  console.log('width is', width, 'height is', height);
  var state = {
    width: width,
    height: height,
    bullets: []
  };

  // calculate starting points for the tanks
  state.tanks = tanks.map(initRandomTank(width, height));

  return state;
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}


function initRandomTank(width, height) {
  return function() {
    return {
      x: getRandomNumber(width),
      y: getRandomNumber(height),
      rotation: Math.random() * (2 * Math.PI),
      velocity: Math.random()
    };
  }
}

// a dummy default ai to do nothing to change the params
function defaultAi(state, tank) {
  return {velocity: tank.velocity, rotation: tank.rotation, shoot: true};
}

// given a game state and array of tank ais, return the newly updated game state
function tick(gameState) {
  gameState.tanks = gameState.tanks.map(updateTankPosition(gameState.width, gameState.height));
  gameState.bullets = gameState.bullets.map(updateBulletPosition).filter(isInsideBounds(gameState.width, gameState.height));

  // TODO:
  // 0. allow tanks to shoot
  // 0. check for collisions between bullets and tanks
  // How to handle bullets that pass through tanks? draw a line, check if line
  // goes through tanks?
  // 0. if collided, remove health and optionally remove tank
  return gameState;
}

function constrain(value, maxValue) {
  return Math.min(maxValue, Math.max(value, 0));
}

function isInsideBounds(maxX, maxY) {
  return function insideBounds(item) {
    return (item.x >= 0 && item.x <= maxX && item.y >= 0 && item.y <= maxY);
  }
}

var BULLET_VELOCITY = 10;
function updateBulletPosition(bullet) {
  return {
    x: getX(bullet.rotation, BULLET_VELOCITY, bullet.x),
    y: getY(bullet.rotation, BULLET_VELOCITY, bullet.y),
    rotation: bullet.rotation
  };
}

function getX(rotation, velocity, x) {
  return x + Math.cos(rotation) * velocity;
}

function getY(rotation, velocity, y) {
  return y + Math.sin(rotation) * velocity;
}


/**
 * Given a tank with a correct rotation and velocity, update the x and y
 */
function updateTankPosition(maxX, maxY) {
  return function tankMap(tank) {
    var newX = constrain(getX(tank.x, tank.rotation, tank.velocity), maxX);
    var newY = constrain(getY(tank.y, tank.rotation, tank.velocity), maxY);

    return {
      velocity: tank.velocity,
      rotation: tank.rotation,
      x: newX,
      y: newY
    };
  }
}

module.exports = {
  startGame: startGame,
  tick: tick,
  defaultAi: defaultAi
};
