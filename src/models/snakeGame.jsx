const {Record} = require('immutable');
const Chance = require('chance');

const Vector = require('./vector');

const GameStatus = require('./gameStatus');
const Snake = require('./snake');

const EMPTY = 0;
const SNAKE = 1;
const GOAL = 2;

// Not great makign this global...but it does work!
let chance = null;

const SnakeGameRecord = Record({
  rows: undefined,
  cols: undefined,
  goal: undefined,
  snake: undefined,
  status: new GameStatus(),
  seed: undefined,
});

class SnakeGame extends SnakeGameRecord {
  static fromDimensions({rows, cols}) {
    return new SnakeGame({
      rows: rows,
      cols: cols,
    }).placeSnake({
      x: Math.floor(cols / 2),
      y: Math.floor(rows / 2),
    });
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

  isOutOfBounds({x, y}) {
    return x < 0 || y < 0 || x >= this.cols || y >= this.rows;
  }

  placeSnake({x, y}) {
    return this.set('snake', Snake.fromStartPosition({x, y}));
  }

  seed(s) {
    chance = new Chance(s);
    return this;
  }

  placeRandomGoal() {
    if (!chance) {
      throw new Error('Must seed() before placing a random number');
    }

    if (this.isFull) {
      return this.set('goal', null);
    }

    let goal;
    do {
      goal = new Vector({
        x: chance.integer({min: 0, max: this.cols - 1}),
        y: chance.integer({min: 0, max: this.rows - 1}),
      });
    } while (this.isSnake(goal));

    return this.placeGoal(goal);
  }

  placeGoal(goal) {
    return this.set('goal', goal);
  }
}

module.exports = SnakeGame;

