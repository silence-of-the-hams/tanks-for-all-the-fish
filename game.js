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

// given a game state and array of tank ais, return the newly updated game state
function tick(gameState, tankAis) {
  return gameState;
}

module.exports = {
  startGame: startGame,
  tick: tick,
  defaultAi: defaultAi
};
