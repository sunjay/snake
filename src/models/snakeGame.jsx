const {Range, Record} = require('immutable');

const Vector = require('../math/vector');

const GameState = require('./gameState');

const EMPTY = 0;
const SNAKE = 1;
const GOAL = 2;

// Body parts added for each food item
const GROWTH_RATE = 5; // parts per goal

const SnakeGameRecord = Record({
  rows: undefined,
  cols: undefined,
  tiles: undefined,
  goal: undefined,
  snakeSize: 0,
  remainingGrowth: 0,
  state: new GameState(),
});

class SnakeGame extends SnakeGameRecord {
  static fromDimensions({rows, cols}) {
    return new SnakeGame({
      rows: rows,
      cols: cols,
      tiles: Range(0, rows).map(() => (
        Range(0, cols).map(() => EMPTY).toList()
      )).toList(),
    }).placeSnake({
      x: Math.floor(cols / 2),
      y: Math.floor(rows / 2),
    }).placeRandomGoal();
  }

  get isFull() {
    return this.snakeSize >= this.rows * this.cols;
  }

  isSnake({x, y}) {
    return this.getTile({x, y}) === SNAKE;
  }

  getTile({x, y}) {
    return this.tiles.get(y).get(x);
  }

  setTile({x, y}, value) {
    return this.update('tiles', (tiles) => (
      tiles.update(y, (row) => row.set(x, value))
    ));
  }

  placeSnake({x, y}) {
    if (this.isSnake({x, y})) {
      return this;
    }

    return this.withMutations((world) => {
      world.update('snakeSize', (size) => size + 1);
      world.setTile({x, y}, SNAKE);
    });
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

