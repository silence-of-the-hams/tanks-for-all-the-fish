/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var game = __webpack_require__(1);
	var maken = __webpack_require__(2);


	function initGame(state) {
	  state.tanks.forEach(function(tank, i) {
	    var div = document.createElement('div');
	    div.className = 'tank';
	    div.style.transform = makeStyle(tank.x, tank.y, tank.rotation);
	    div.id = "" + i;
	    document.body.appendChild(div);
	  });
	}

	function makeStyle(x, y, rad) {
	  return 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + rad + 'rad)';
	}

	function render(state) {
	  state.tanks.forEach(function(tank, i) {
	    var div = document.getElementById(i);
	    div.style.transform = makeStyle(tank.x, tank.y, tank.rotation);
	  });
	}

	function tick() {
	  render(state);
	  state = game.tick(state, ais);
	  window.requestAnimationFrame(tick);
	}

	var ais = maken(10, game.defaultAi);
	var state = game.startGame(800, 800, ais);
	initGame(state);
	tick();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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

	    tankResult.velocity = constrain(tankResult.velocity, 4);
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
	  console.log('bullet is', bullet);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* make an array of size n of objects
	 * `makeN(3, 'durp')` -> ['durp','durp', 'durp']
	 * EAT YOUR HEART OUT CROCKFORD
	 **/
	function makeN(n, obj) {
	  // gotta use .apply(null) because Array(n) makes a new empty array of size n and map behaves starngely
	  // Array.apply(null, Array(n)) creates an array of size n with undefined as the value of every item
	  // we can then call map on it to get back an array with n `obj`s.
	  return Array.apply(null, Array(n)).map(function() { return obj; });
	}

	module.exports = makeN;


/***/ }
/******/ ])