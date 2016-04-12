const Vector = require('./vector');
const Snake = require('./snake');

class Grid {
  static EMPTY = 0;
  static SNAKE = 1;
  static GOAL = 2;

  constructor({rows, cols}) {
    this.rows = rows;
    this.cols = cols;

    this.snake = new Snake([
      new Vector({x: 0, y: 0}),
      new Vector({x: 1, y: 0}),
      new Vector({x: 2, y: 0}),
    ]);
    this.goal = new Vector({
      x: Math.floor(Math.random() * (this.cols + 1)),
      y: Math.floor(Math.random() * (this.rows + 1)),
    });
  }

  render() {
    const tiles = Array.from(Array(this.rows)).map(() => (
      Array.from(Array(this.cols)).map(() => Grid.EMPTY)
    ));

    tiles[this.goal.y][this.goal.x] = Grid.GOAL;

    for (let {x, y} of this.snake.body) {
      tiles[y][x] = Grid.SNAKE;
    }

    return tiles;
  }

  static isEmptyTile(tile) {
    return tile === this.EMPTY;
  }

  static isSnakeTile(tile) {
    return tile === this.SNAKE;
  }

  static isGoalTile(tile) {
    return tile === this.GOAL;
  }
}

module.exports = Grid;

