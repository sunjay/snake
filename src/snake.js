const Vector = require('./vector');
const Direction = require('./direction');

class Snake {
  constructor({startX, startY}) {
    this.body = [
      // Head has to be first
      new Vector({x: startX, y: startY}),
    ];
    this.afterTail = null;
    this.direction = Direction.E;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  canTravelInDirection(direction) {
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
    const delta = this.body[1].sub(this.head()).normalize();
    return !delta.equals(direction);
  }

  get size() {
    return this.body.length;
  }

  contains(vec) {
    return this.body.some((b) => b.equals(vec));
  }

  isWithinSelf() {
    const head = this.head();
    return this.body.slice(1).some((b) => b.equals(head));
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

