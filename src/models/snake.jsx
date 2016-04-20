const {Record, List} = require('immutable');

const Vector = require('./vector');
const Direction = require('./direction');

// Body parts added for each food item
const GROWTH_RATE = 5; // parts per goal

const SnakeRecord = Record({
  body: [],
  direction: undefined,
  pendingGrowth: 0,
});

class Snake extends SnakeRecord {
  static fromStartPosition({x, y}) {
    return new Snake({
      // First element is the head
      body: List.of(new Vector({x, y})),
    });
  }

  get length() {
    return this.body.size;
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
    const delta = this.body.get(1).sub(this.head()).normalize();
    return !delta.equals(direction);
  }

  contains(vec) {
    vec = new Vector(vec);
    return this.body.some((b) => b.equals(vec));
  }

  isWithinSelf() {
    const head = this.head();
    return this.body.slice(1).some((b) => b.equals(head));
  }

  head() {
    return this.body.first();
  }

  tail() {
    return this.body.last();
  }

  grow() {
    return this.update('pendingGrowth', (g) => g + GROWTH_RATE);
  }

  shift() {
    let nextPosition = this.head().add(this.direction);
    let body = this.body.map((position, i) => {
      const tmp = nextPosition;
      nextPosition = position;
      return tmp;
    });

    if (this.pendingGrowth) {
      body = body.push(nextPosition);
    }

    return this.set('body', body);
  }
}

module.exports = Snake;

