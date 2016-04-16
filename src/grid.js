const Vector = require('./vector');
const Snake = require('./snake');
const FrameRate = require('./fps');

const {GameLost} = require('./exceptions');

class Grid {
  static EMPTY = 0;
  static SNAKE = 1;
  static GOAL = 2;

  // Append this many body parts per food collected
  static APPENDS_PER_FOOD = 5;

  constructor({rows, cols}) {
    this.rows = rows;
    this.cols = cols;

    this.fps = new FrameRate(15);

    this.snake = new Snake({
      startX: Math.floor(this.cols / 2),
      startY: Math.floor(this.rows / 2),
    });
    this.goal = this.generateGoal();
    this.leftoverAppends = 0;
  }

  get isFull() {
    return this.snake.size >= this.rows * this.cols;
  }

  generateGoal() {
    if (this.isFull) {
      return null;
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

  outOfBounds({x, y}) {
    return x < 0 || y < 0 || x >= this.cols || y >= this.rows;
  }

  update() {
    if (!this.fps.shouldUpdate()) {
      return;
    }

    const head = this.snake.head();
    if (head.equals(this.goal)) {
      this.leftoverAppends += Grid.APPENDS_PER_FOOD;
      this.goal = this.generateGoal();
    }
    else if (this.snake.isWithinSelf()) {
      throw new GameLost('bumped into yourself');
    }
    else if (this.outOfBounds(head)) {
      throw new GameLost('out of bounds');
    }

    this.snake.shift();

    if (this.leftoverAppends > 0) {
      this.snake.append();
      this.leftoverAppends -= 1;
    }
  }

  render() {
    const tiles = Array.from(Array(this.rows)).map(() => (
      Array.from(Array(this.cols)).map(() => Grid.EMPTY)
    ));

    if (this.goal) {
      tiles[this.goal.y][this.goal.x] = Grid.GOAL;
    }

    for (let {x, y} of this.snake.body) {
      if (this.outOfBounds({x, y})) {
        continue;
      }

      tiles[y][x] = Grid.SNAKE;
    }

    return {
      rows: this.rows,
      cols: this.cols,
      tiles,
    };
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

