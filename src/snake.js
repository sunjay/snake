const Vector = require('./vector');
const Direction = require('./direction');

class Snake {
  constructor() {
    this.body = [
      // Head has to be first
      new Vector({x: 2, y: 0}),
      new Vector({x: 1, y: 0}),
      new Vector({x: 0, y: 0}),
    ];
    this.afterTail = null;
    this.direction = Direction.E;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  canTravelInDirection(direction) {
    return !Direction.isOpposite(direction, this.direction);
  }

  get size() {
    return this.body.length;
  }

  contains(vec) {
    return this.body.some((b) => b.equals(vec));
  }

  head() {
    return this.body[0];
  }

  tail() {
    return this.body[this.body.length - 1];
  }

  shift() {
    let nextPosition = this.head().add(this.direction);
    for (let i = 0; i < this.body.length; i++) {
      const position = this.body[i];
      this.body[i] = nextPosition;
      nextPosition = position;
    }

    this.afterTail = nextPosition;
  }

  append() {
    if (!this.afterTail) {
      throw new Error('Snake must shift before a new item can be appended');
    }

    this.body.push(this.afterTail);
    this.afterTail = null;
  }
}

module.exports = Snake;

