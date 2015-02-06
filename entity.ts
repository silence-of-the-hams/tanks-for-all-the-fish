'use strict';
export var MAX_HEALTH = 8;

function getX(rotation: number, velocity: number, x: number): number {
  return x + Math.cos(rotation) * velocity;
}

function getY(rotation: number, velocity: number, y: number): number {
  return y + Math.sin(rotation) * velocity;
}

function constrain(value: number, maxValue: number, minValue: number = 0): number {
  return Math.min(maxValue, Math.max(value, minValue));
}

var TANK_SHOT_INTERVAL = 100;
function calculateTimeUntilReadyToShoot(tank: Tank): number {
  var now = Date.now();
  // it takes 4 seconds until a tank can shoot again
  return Math.max((tank.lastShotTime + TANK_SHOT_INTERVAL) - now, 0);
}

function canTankShoot(tank: Tank): boolean {
  return calculateTimeUntilReadyToShoot(tank) <= 0;
}

export class Tank {
  static WIDTH: number = 16;
  static HEIGHT: number = 16;
  health: number = MAX_HEALTH;
  constructor(
    public x: number,
    public y: number,
    public velocity: number,
    public rotation: number,
    public ai: AI,
    public name: string,
    public color: string
  ) {}
  lastShotTime: number = 0;
  timeUntilReadyToShoot: number = 0;
  tick(maxX: number, maxY: number): void {
    this.x = constrain(getX(this.rotation, this.velocity, this.x), maxX);
    this.y = constrain(getY(this.rotation, this.velocity, this.y), maxY);
    this.timeUntilReadyToShoot = calculateTimeUntilReadyToShoot(this);
  }
  decrementHealth(): void {
    this.health -= 1;
  }
  updateVelocityAndRotationFromAIResults(result: TankMovementResult): void {
    this.velocity = constrain(result.velocity, 1, -1);
    this.rotation = this.rotation + (constrain(result.angularVelocity, 1, -1) * ((Math.PI * 2) / 30));
  }
  shoot(): Bullet {
    if (!canTankShoot(this)) {
      return;
    }
    this.lastShotTime = Date.now();
    this.timeUntilReadyToShoot = calculateTimeUntilReadyToShoot(this);
    return new Bullet(this.x, this.y, this.rotation, this.name);
  }
  serialize(): any {
    return {
      x: this.x,
      y: this.y,
      color: this.color,
      rotation: this.rotation,
      velocity: this.velocity,
      timeUntilShoot: this.timeUntilReadyToShoot,
      health: this.health,
    };
  }
}

var BULLET_VELOCITY = 20;
export class Bullet {
  velocity: number = BULLET_VELOCITY;
  constructor(
    public x: number,
    public y: number,
    public rotation: number,
    public shotBy: string
  ) {}
  // bullets are removed by engine when they go out of bounds, so don't
  // check here
  tick(maxX: number, maxY: number): void {
    this.x = getX(this.rotation, this.velocity, this.x);
    this.y = getY(this.rotation, this.velocity, this.y);
  }
  serialize(): any {
    return {
      x: this.x,
      y: this.y,
      velocity: BULLET_VELOCITY,
      rotation: this.rotation
    };
  }
}

export interface TankMovementResult {
  angularVelocity: number;
  shoot: boolean;
  velocity: number;
};

export interface GameState {
  tanks: Tank[];
  bullets: Bullet[];
  width: number;
  height: number;
  victor?: Tank;
}

function serialize(game: GameState): any {
  return {
    width: game.width,
    height: game.height,
    tanks: game.tanks.map(function(t:Tank): any { return t.serialize() }),
    bullets: game.bullets.map(function(b:Bullet): any { return b.serialize() }),
  };
}

export interface AI {
  (state: GameState): TankMovementResult;
  aiName?: string;
}

function getRandomColor() {
  var colors = ['grey', 'red', 'yellow', 'blue', 'green', 'pink', 'white'];
  var i = Math.floor(Math.random() * colors.length)
  return colors[i];
}

function getRandomInteger(max: number): number {
  return Math.floor(Math.random() * max);
}

function initRandomTank(width, height) {
  return function(ai: AI): Tank {
    return new Tank(getRandomInteger(width), getRandomInteger(height),
      Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, ai, ai.aiName, getRandomColor());
  }
}

export function startGame(width, height, ais): GameState {
  var state: GameState = {
    tanks: ais.map(initRandomTank(width, height)),
    bullets: [],
    width: width,
    height: height
  }
  return state;
}

function isInBounds(bullet: Bullet, game: GameState): boolean {
  return (bullet.x >= 0 && bullet.x <= game.width && bullet.y >= 0 &&
          bullet.y <= game.height);
}

function isColliding(bullet: Bullet, tank: Tank): boolean {
  return (
          bullet.x >= tank.x - (Tank.WIDTH / 2) &&
          bullet.x <= tank.x + (Tank.WIDTH / 2) &&
          bullet.y >= tank.y - (Tank.HEIGHT / 2) &&
          bullet.y <= tank.y + (Tank.HEIGHT / 2));
}

function isDead(t: Tank): boolean {
  return t.health <= 0;
}

// TODO: make tank own bullets not hit themselves
// TODO: check victory condition in renderer

var defaultRes = {shoot: true, velocity: 1, angularVelocity: 0.1};
export function tick(game: GameState, ais: AI[]): GameState {
  var serializedState = serialize(game);
  var results: TankMovementResult[] = game.tanks.map(function(tank) { 
    var res;
    try {
      res = tank.ai(serializedState);
      if (!res) {
        res = defaultRes;
      }
    } catch (e) {
      console.error('tank', tank.name, 'is throwing exceptions, oh no!');
      res = defaultRes;
    }
    return res;
  });

  // update tank positions based on ai results
  results.forEach(function(result: TankMovementResult, i: number) {
    game.tanks[i].updateVelocityAndRotationFromAIResults(result);
    if (result.shoot) {
      // only shoot if they are allowed to
      var bullet = game.tanks[i].shoot();
      bullet && game.bullets.push(bullet);
    }
  });

  // move tanks
  game.tanks.forEach(function(t: Tank) { return t.tick(game.width, game.height) });
  // move bullets
  game.bullets.forEach(function(b: Bullet) { return b.tick(game.width, game.height) });

  // check for collisions
  // for each bullet
  //   for each tank
  //     check if bullet coordinates are inside tank coords (bullet.x < tank.x + (width / 2) && >=kkkkkkkkkk
  // check for collisions
  //   update health, remove tanks if needed
  game.bullets = game.bullets.filter(function(b: Bullet) {
    if (!isInBounds(b, game)) {
      return false;
    }

    for (var i = 0; i < game.tanks.length; i++) {
      if (isColliding(b, game.tanks[i])) {
        game.tanks[i].decrementHealth();
        if (isDead(game.tanks[i])) {
          game.tanks.splice(i, 1);
        }
        return false;
      }
    }
    return true;
  });

  // TODO: notify of glorious victory
  if (game.tanks.length == 1) {
    console.log('glorious victory!');
    game.victor = game.tanks[0];
  } else if (game.tanks.length == 0) {
    console.log('wat');
  }

  return game;
}
