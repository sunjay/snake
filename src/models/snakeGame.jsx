const {Range, Record} = require('immutable');

const Vector = require('./vector');

const GameState = require('./gameState');
const Snake = require('./snake');

const EMPTY = 0;
const SNAKE = 1;
const GOAL = 2;

const SnakeGameRecord = Record({
  rows: undefined,
  cols: undefined,
  goal: undefined,
  snake: undefined,
  state: new GameState(),
});

class SnakeGame extends SnakeGameRecord {
  static fromDimensions({rows, cols}) {
    return new SnakeGame({
      rows: rows,
      cols: cols,
    }).placeSnake({
      x: Math.floor(cols / 2),
      y: Math.floor(rows / 2),
    }).placeRandomGoal();
  }

  get isFull() {
    return this.snake.length >= this.rows * this.cols;
  }

  isSnake({x, y}) {
    return this.snake.contains({x, y});
  }

  isGoal({x, y}) {
    return this.goal ? this.goal.equals(new Vector({x, y})) : false;
  }

  isValidDirection(direction) {
    // Only allow travel in a given direction
    // if it would not directly collide with the
    // segment just after the head
    // In general, colliding with any other part is allowed
    // This also allows the user to change their mind
    // Example: if heading downwards after going left,
    // the user could hit right and then left immediately
    // That's okay with this method, since it doesn't use
    // the current direction, but instead uses a possible
    // collision to determine if the direction is okay
    if (this.body.length < 2) {
      return true;
    }
    // The vector from the second body part to the head
    const delta = this.body[1].sub(this.head()).normalize();
    return !delta.equals(direction);
  }

  placeSnake({x, y}) {
    return this.set('snake', Snake.fromStartPosition({x, y}));
  }

  placeRandomGoal() {
    if (this.isFull) {
      return this.set('goal', null);
    }

    let goal;
    do {
      goal = new Vector({
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows),
      });
    } while (this.isSnake(goal));

    return this.set('goal', goal);
  }
}

module.exports = SnakeGame;

