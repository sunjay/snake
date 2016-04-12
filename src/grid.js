const Vector = require('./vector');
const Snake = require('./snake');

class Grid {
  static EMPTY = 0;
  static SNAKE = 1;

  constructor({rows, cols}) {
    this.rows = rows;
    this.cols = cols;

    this.snake = new Snake([
      new Vector({x: 0, y: 0}),
      new Vector({x: 1, y: 0}),
      new Vector({x: 2, y: 0}),
    ]);
  }

  render() {
    const tiles = Array.from(Array(this.rows)).map(() => (
      Array.from(Array(this.cols)).map(() => Grid.EMPTY)
    ));

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
}

module.exports = Grid;

