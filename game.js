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
  return {velocity: tank.velocity, rotation: tank.rotation};
}

var i = 0;
// given a game state and array of tank ais, return the newly updated game state
function tick(gameState) {
  gameState.tanks = gameState.tanks.map(updateTankPosition(gameState.width, gameState.height));

  if (i % 100 == 0) {
    //console.log('ticking', gameState);
  }
  i++;
  //gameState.bullets = gameState.bullets.map(updateBulletPosition);
  return gameState;
}

function constrain(value, maxValue) {
  return Math.min(800, Math.max(value, 0));
}


/**
 * Given a tank with a correct rotation and velocity, update the x and y
 */
function updateTankPosition(maxX, maxY) {
  return function tankMap(tank) {
    var newX = constrain(tank.x + Math.cos(tank.rotation) * tank.velocity);
    // flip y because coords start at 0,0 in the top left
    var newY = constrain(tank.y +   Math.sin(tank.rotation) * tank.velocity);

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
