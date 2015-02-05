/// <reference path="./types/require.d.ts" />
import game = require('./entity');

/*var colors = ['black', 'grey', 'red', 'yellow', 'blue', 'green', 'pink', 'white'];*/

/*function colorsToImages(colors) {*/
  /*return colors.reduce((memo, c) => {*/
    /*var i = new Image();*/
    /*i.src = `/img/tank-${c}.png`;*/
    /*memo[c] = i;*/
    /*return memo*/
  /*}, {});*/
/*}*/
/*var colorToImage = colorsToImages(colors);*/

// TODO: map tanks to colors

var tankImage = new Image(); tankImage.src = '/img/tank-red.png';
var bulletImage = new Image(); bulletImage.src = '/img/bullet.png';

var context = (<HTMLCanvasElement>document.querySelector('canvas')).getContext('2d');

function draw(state: game.GameState, ctx: CanvasRenderingContext2D) {
  ctx.font = '10px "Helvetica Neue"';
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
    // draw tank name
    ctx.fillText(tank.name, 0, 30);
    // center on tank image which is 16 x 16
    ctx.translate(8, 8);
    ctx.rotate(tank.rotation);
    ctx.drawImage(tankImage, -8, -8);
    ctx.restore();
  }
}

function drawVictory(victor: game.Tank, ctx: CanvasRenderingContext2D): void {
  ctx.font = '30px "Helvetica Neue"';
  ctx.clearRect(0, 0, state.width, state.height);
  ctx.fillText(`Congratulations ${victor.name} on glorious victory!`, 100, 100);
}

var ais = require('./ais');
var state = game.startGame(800, 800, ais);

function tick() {
  draw(state, context);
  state = game.tick(state, ais);

  if (state.victor) {
    return drawVictory(state.victor, context);
  }
  // TODO: different colors for different tanks?
  window.requestAnimationFrame(tick);
}

tick();
