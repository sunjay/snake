const {Record, List} = require('immutable');

const Vector = require('./vector');

const SpaceRecord = Record({
  topLeft: undefined,
  bottomRight: undefined,
  // adjacent spaces
  adjacents: List.of(),
});

class Space extends SpaceRecord {
  get width() {
    // need to add 1 because coordinate system starts at 0
    return this.bottomRight.x - this.topLeft.x + 1;
  }

  get height() {
    // need to add 1 because coordinate system starts at 0
    return this.bottomRight.y - this.topLeft.y + 1;
  }

  get area() {
    return this.width * this.height;
  }
}

const TraversableSpaceRecord = Record({
  // List of Space
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
      spaces: List.of(new Space({
        topLeft: new Vector({x: 0, y: 0}),
        bottomRight: new Vector({x: cols - 1, y: rows - 1}),
      })),
    });
  }

  /**
   * Fill in the given space as not traversable
   */
  fill({x, y}) {
    // find the space that contains this point
    // resize that space to no longer contain this point by doing as small of a readjustment as possible
    // resize the adjacents to fill in the extra traversable space
    // add new adjacents as necessary to fill in any leftovers
    return this;
  }

  /**
   * Mark the given space as traversable
   */
  unfill({x, y}) {
    // find any spaces adjacent to this space
    // resize the first space that can easily fit here
    // create a new space if necessary
    return this;
  }
}

module.exports = TraversableSpace;

