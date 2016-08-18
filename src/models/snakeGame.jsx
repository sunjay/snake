const {Record} = require('immutable');
const Chance = require('chance');

const Vector = require('./vector');

const GameStatus = require('./gameStatus');
const TraversableSpace = require('./traversableSpace');
const Snake = require('./snake');

const EMPTY = 0;
const SNAKE = 1;
const GOAL = 2;

const chance = new Chance();

const SnakeGameRecord = Record({
  rows: undefined,
  cols: undefined,
  goal: undefined,
  snake: undefined,
  traversableSpace: undefined,
  status: new GameStatus(),
});

class SnakeGame extends SnakeGameRecord {
  static fromDimensions({rows, cols}) {
    return new SnakeGame({
      rows: rows,
      cols: cols,
      traversableSpace: TraversableSpace.fromDimensions({rows, cols}),
    }).placeSnake({
      x: Math.floor(cols / 2),
      y: Math.floor(rows / 2),
    });
  }

  get isFull() {
    return this.snake.length >= this.rows * this.cols;
  }

  /**
   * Returns if the given tile can be *safely* moved into by the snake
   * This means that there is no other part of the snake on this tile
   * and that the position is not out of bounds
   */
  isTraversable({x, y}) {
    return !this.isOutOfBounds({x, y}) && !this.isSnake({x, y});
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
    return this.withMutations((game) => {
      game.set('snake', Snake.fromStartPosition({x, y}));
      game.set('traversableSpace', TraversableSpace.fromDimensions({
        rows: game.rows,
        cols: game.cols,
      }).fill({x, y}));
    });
  }

  placeRandomGoal() {
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

  shift() {
    // Need to store this because the tail often moves out of this position
    // and needs to be unfilled
    const tail = this.snake.tail();

    return this.withMutations((game) => {
      game.update('snake', (snake) => snake.shift());

      game.update('traversableSpace', (space) => {
        return space.withMutations((space) => {
          space.fill(game.snake.head());

          // Need to check this because the tail doesn't always shift
          if (!tail.equals(game.snake.tail())) {
            space.unfill(tail);
          }
        });
      });
    });
  }
}

module.exports = SnakeGame;

