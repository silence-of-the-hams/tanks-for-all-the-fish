var game = require('./game');
var maken = require('maken');

var tankImage = new Image(); tankImage.src = '/img/tank.png';
var bulletImage = new Image(); bulletImage.src = '/img/bullet.png';
window.context = document.querySelector('canvas').getContext('2d');

function draw(state, ctx) {
  ctx.clearRect(0, 0, state.width, state.height);

  state.tanks.forEach(drawTank);
  state.bullets.forEach(drawBullet);

  function drawBullet(bullet) {
    //return;
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    // bullet is 2x2
    ctx.translate(1,1);
    ctx.rotate(bullet.rotation);
    ctx.drawImage(bulletImage, -1, -1);
    ctx.restore();
  }

  function drawTank(tank) {
    ctx.save();
    ctx.translate(tank.x, tank.y);
    // center on tank image which is 16 x 16
    ctx.translate(8, 8);
    ctx.rotate(tank.rotation);
    ctx.drawImage(tankImage, -8, -8);
    ctx.restore();
  }
}

var ais = maken(10, game.defaultAi);
var state = game.startGame(800, 800, ais);

function tick() {
  draw(state, context);
  state = game.tick(state, ais);
  window.requestAnimationFrame(tick);
}

tick();
