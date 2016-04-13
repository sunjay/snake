const Vector = require('./vector');
const Snake = require('./snake');
const FrameRate = require('./fps');

const {GameLost} = require('./exceptions');

class Grid {
  static EMPTY = 0;
  static SNAKE = 1;
  static GOAL = 2;

  constructor({rows, cols}) {
    this.rows = rows;
    this.cols = cols;

    this.fps = new FrameRate(10);

    this.snake = new Snake();
    this.goal = this.generateGoal();
  }

  get isFull() {
    return this.snake.size >= this.rows * this.cols;
  }

  generateGoal() {
    if (this.isFull) {
      return new Vector({x: -1, y: -1});
    }

    let goal;
    do {
      goal = this.randomGoal();
    } while (this.snake.contains(goal));

    return goal;
  }

  randomGoal() {
    return new Vector({
      x: Math.floor(Math.random() * this.cols),
      y: Math.floor(Math.random() * this.rows),
    });
  }

  update() {
    if (!this.fps.shouldUpdate()) {
      return;
    }

    const head = this.snake.head();
    if (head.equals(this.goal)) {
      this.snake.append();
      this.goal = this.generateGoal();
    }
    else if (this.snake.isWithinSelf()) {
      throw new GameLost('bumped into yourself');
    }
    else if (head.x < 0 || head.y < 0 || head.x >= this.cols || head.y >= this.rows) {
      throw new GameLost('out of bounds');
    }

    this.snake.shift();
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

