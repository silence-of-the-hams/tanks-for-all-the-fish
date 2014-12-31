function startGame(width, height, tanks) {
  var state = {
    width: width,
    height: height,
    bullets: []
  };

  // calculate starting points for the tanks
  state.tanks = tanks.map(initRandomTank(width, height));

  return state;
}

function getRandomInteger(max) {
  return Math.floor(Math.random() * max);
}

var MAX_TANK_VELOCITY = 2;

function initRandomTank(width, height) {
  return function() {
    return {
      x: getRandomInteger(width),
      y: getRandomInteger(height),
      rotation: Math.random() * 2 * Math.PI,
      velocity: Math.random() * MAX_TANK_VELOCITY
    };
  }
}

// a dummy default ai to do nothing to change the params
function defaultAi(tank, state) {
  return {velocity: tank.velocity, rotation: tank.rotation, shoot: true};
}

// tanks need to keep track of when they last shot, or time until they can shoot.
// if the time until shoot is 0, they can shoot now
// otherwise, orders to shoot will be ignored

// given a game state and array of tank ais, return the newly updated game state
function tick(gameState, ais) {
  gameState.bullets = gameState.bullets.map(updateBulletPosition).filter(isInsideBounds(gameState.width, gameState.height));

  var tanks = [];
  gameState.tanks.forEach(function(tank, i) {
    // tankResult == {velocity, rotation, shoot}
    var tankResult = ais[i](tank, gameState);

    //console.log('tankResult', tankResult);
    tankResult.velocity = constrain(tankResult.velocity, MAX_TANK_VELOCITY);
    tankResult.rotation = constrain(tankResult.rotation, 2 * Math.PI);

    var tank = updateTankPosition(gameState.width, gameState.height, tank, tankResult);
    if (tankResult.shoot) {
      gameState.bullets.push(fireBullet(tank.x, tank.y, tank.rotation));
    }

    tanks.push(tank);
  });

  gameState.tanks = tanks;

  // TODO:
  // 0. allow tanks to shoot
  // 0. enforce interval since last shot
  // 0. check for collisions between bullets and tanks
  // How to handle bullets that pass through tanks? draw a line, check if line
  // goes through tanks?
  // 0. if collided, remove health and optionally remove tank
  return gameState;
}

function fireBullet(x, y, rotation) {
  return {x:x, y:y, rotation:rotation};
}

// constrain a value between 0 and a maximum value
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
  //console.log('bullet is', bullet);
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
function updateTankPosition(maxX, maxY, tank, tankResult) {
  var newX = constrain(getX(tankResult.rotation, tankResult.velocity, tank.x), maxX);
  var newY = constrain(getY(tankResult.rotation, tankResult.velocity, tank.y), maxY);

  return {
    velocity: tankResult.velocity,
    rotation: tankResult.rotation,
    x: newX,
    y: newY
  };
}

module.exports = {
  startGame: startGame,
  tick: tick,
  defaultAi: defaultAi
};
