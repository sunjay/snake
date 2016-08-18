const {Record, List} = require('immutable');

const Vector = require('./vector');

const RectangleRecord = Record({
  topLeft: undefined,
  bottomRight: undefined,
});

class Rectangle extends RectangleRecord {
  get width() {
    return this.bottomRight.x - this.topLeft.x;
  }

  get height() {
    return this.bottomRight.y - this.topLeft.y;
  }

  get area() {
    return this.width * this.height;
  }
}

const TraversableSpaceRecord = Record({
  // List of Rectangle
  spaces: List.of(),
  rows: undefined,
  cols: undefined,
});

class TraversableSpace extends TraversableSpaceRecord {
  /**
   * Creates a TraversableSpace where the entire space is traversable
   * across the given dimensions
   */
  static fromDimensions({rows, cols}) {
    return new TraversableSpace({
      rows, cols,
      spaces: List.of(new Rectangle({
        topLeft: new Vector({x: 0, y: 0}),
        bottomRight: new Vector({x: cols - 1, y: rows - 1}),
      })),
    });
  }

  /**
   * Fill in the given space as not traversable
   */
  fill({x, y}) {
    return this;
  }

  /**
   * Mark the given space as traversable
   */
  unfill({x, y}) {
    return this;
  }
}

module.exports = TraversableSpace;

