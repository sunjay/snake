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

