var game = require('./game');
var maken = require('maken');


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
