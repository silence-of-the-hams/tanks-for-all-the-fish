#tanks-for-all-the-fish

![Tanks for all the fish](./art/Logo.png)

This is a tank simulation game but also maybe it controls tanks in real life
like in wargames?

Write an AI, compete against other AIs, and battle for glorious victory!


## Installation
```bash
npm i
webpack -w
npm start
```

visit [http://localhost:3000](http://localhost:3000)


## Writing an AI

A tank AI is a function that takes in the state of the world and returns an
object describing how you want your tank to act.

### The Game State
The game state is an object describing the position, velocity and rotation of
all tanks and bullets in the game. You can use this information to dodge
bullets, chase specific tanks, try to kill the tank with the lowest health, or
whatever else you want! The game state is an object that looks like this:

```JavaScript
{
  width: 800, // width of the arena
  height: 800, // height of the arena
  tanks: [ // array of all tanks in the game, including your own
    {
      x: 100, // x position. left is 0, increases as you go right
      y: 100, // y position. top is 0, increases as you go down
      velocity: 1, // between -1 and 1. tanks can go backwards too!
      rotation: 3.14, // between 0 and 2 * Math.PI. In radians. 0 is facing right.
      health: 3, // tanks start with 3, and die if they reach 0.
                 // each hit by a bullet removes 1 health.
      timeUntilShoot: 3000 // time in milliseconds until the tank can shoot again
      name: 'Yolo Swaggins' // tank name, so you can tell whose it is!
    }
  ],
  bullets: [ // an array of all bullets in the game
    {
      x: 100,
      y: 100,
      velocity: 20, // bullets are always the same velocity
      rotation: 1.56 // in radians, follows the unit circle
    }
  ]
}
```

### The AI Result
Your AI function should return an object that looks like this:

```JavaScript
{
  velocity: 1, // a number between -1 and 1 describing how fast your tank moves each tick
  angularVelocity: 0.3, // a number between -1 and 1 describing how fast your tank
                        // rotates. positive is clockwise, negative is
                        // counterclockwise.
  shoot: true // a boolean saying if your tank should shoot this tick or not.
              // note: you will only be able to shoot if your timeUntilShoot is 0
              // returning true when you can't shoot won't do anything
}
```

### An Example Function

Here is an example AI function. It just slowly turns clockwise and shoots as
often as possible, ignoring all state.

```javascript
function ai(worldState) {
  return {shoot: true, velocity: 0.5, angularVelocity: 0.2};
}
```

