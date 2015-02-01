import game = require('./entity');
var tankImage = new Image(); tankImage.src = '/img/tank.png';
var bulletImage = new Image(); bulletImage.src = '/img/bullet.png';

var context = (<HTMLCanvasElement>document.querySelector('canvas')).getContext('2d');

function draw(state: game.GameState, ctx: CanvasRenderingContext2D) {
  console.log('durp');
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


interface AI {
  (state: game.GameState): any;
  name: string;
}

// TODO: do i need to know what i have?
var aiThing = <AI>function(state: game.GameState) {
  return {angularVelocity: 0.2, shoot: true, velocity: 1};
}
aiThing.name = 'Hurp';

// TODO: make an ai function that also has a name
var ais = [aiThing, aiThing, aiThing, aiThing, aiThing, aiThing];
//var ais = maken(10, game.defaultAi);
var state = game.startGame(800, 800, ais);

function tick() {
  draw(state, context);
  state = game.tick(state, ais);
  // TODO: check victory condition
  window.requestAnimationFrame(tick);
}

tick();
