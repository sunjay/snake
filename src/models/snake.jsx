const {Record, List} = require('immutable');

const Vector = require('./vector');

// Body parts added for each food item
const GROWTH_RATE = 5; // parts per goal

const LineRecord = Record({
  front: undefined,
  back: undefined,
});

class Line extends LineRecord {
  static fromPoint({x, y}) {
    return new Line({
      front: new Vector({x, y}),
      back: new Vector({x, y}),
    });
  }

  get totalSize() {
    // This works because lines are always horizontal or vertical so one
    // of these differences will be zero
    return Math.abs(this.front.x - this.back.x) + Math.abs(this.front.y - this.back.y) + 1;
  }

  get direction() {
    return this.front.sub(this.back).normalize();
  }

  contains({x, y}) {
    const {x: f_x, y: f_y} = this.front;
    const {x: b_x, y: b_y} = this.back;

    // Given vertex must be horizontally or vertically within the line
    return (
      f_x === x && b_x === x &&
      y >= Math.min(f_y, b_y) && y <= Math.max(f_y, b_y)
    ) || (
      f_y === y && b_y === y &&
      x >= Math.min(f_x, b_x) && x <= Math.max(f_x, b_x)
    );
  }

  hash() {
    return this.front.hash() + '|' + this.back.hash();
  }
}

const SnakeRecord = Record({
  body: List.of(),
  direction: undefined,
  pendingGrowth: 0,
});

class Snake extends SnakeRecord {
  static fromStartPosition({x, y}) {
    return new Snake({
      // First element is the head
      body: List.of(Line.fromPoint({x, y})),
      // Can be used to set the initial size of the snake
      pendingGrowth: 0,
    });
  }

  get length() {
    return this.body.reduce((t, L) => t + L.totalSize, 0);
  }

  setDirection(direction) {
    if (!this.canTravelInDirection(direction)) {
      return this;
    }
    return this.set('direction', direction);
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
    if (this.length < 2) {
      return true;
    }

    const frontLine = this.body.first();

    let delta;
    if (frontLine.totalSize === 1) {
      // if the front line is only size 1, use the second line front as well
      delta = this.body.get(1).front.sub(frontLine.front).normalize();
    }
    else {
      delta = frontLine.direction.negate();
    }

    return !delta.equals(direction);
  }

  contains(vec) {
    vec = new Vector(vec);
    return this.body.some((b) => b.contains(vec));
  }

  isWithinSelf() {
    const head = this.head();
    return this.body.slice(1).some((b) => b.contains(head));
  }

  head() {
    return this.body.first().front;
  }

  tail() {
    return this.body.last().back;
  }

  grow() {
    return this.update('pendingGrowth', (g) => g + GROWTH_RATE);
  }

  shift() {
    let body = this.body;

    // append one to the front
    const frontLine = body.first();
    if (frontLine.totalSize === 1 || frontLine.direction.equals(this.direction)) {
      body = body.set(0, frontLine.update('front',
        (front) => front.add(this.direction)));
    }
    else {
      body = body.unshift(Line.fromPoint(frontLine.front.add(this.direction)));
    }

    const backLine = body.last();

    let pendingGrowth = this.pendingGrowth;
    if (pendingGrowth) {
      // just don't take one off from the back
      pendingGrowth--;
    }
    // remove one from the back or remove the line if it will be empty
    else if (backLine.totalSize === 1) {
      body = body.pop();
    }
    else {
      body = body.set(body.size - 1, backLine.update('back',
        (back) => back.add(backLine.direction)));
    }

    return this.set('body', body).set('pendingGrowth', pendingGrowth);
  }

  hash() {
    return this.body.map((L) => L.hash()).join(';');
  }
}

module.exports = Snake;

