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

  contains({x, y}) {
    return (
      x >= this.topLeft.x && x <= this.bottomRight.x &&
      y >= this.topLeft.y && y <= this.bottomRight.y
    );
  }

  /**
   * Return a resized space that avoids the given point
   * The returned space is guarenteed to not contain the given point
   * Returns null if resizing resulted in none of this space being leftover
   * 
   * Assumes the given point is within this space
   */
  avoid({x, y}) {
    // This calculates the offset between each edge and the point
    const topLeftOffset = this.topLeft.sub({x, y});
    const bottomRightOffset = this.bottomRight.sub({x, y});

    // Calcualte the minimum movement by calculating the amount
    // that each edge would be moved
    const [amount, move] = List.of(
      // The sign of the offset is opposite the amount we want to move
      // The +1 makes sure we actually avoid the point
      [-topLeftOffset.x + 1, this.moveLeftEdge],
      [-bottomRightOffset.x - 1, this.moveRightEdge],
      [-topLeftOffset.y + 1, this.moveTopEdge],
      [-bottomRightOffset.x - 1, this.moveBottomEdge],
    ).minBy((x) => Math.abs(x[0]));

    const space = move.call(this, amount);
    if (space.area === 0) {
      return null;
    }
    return space;
  }

  moveLeftEdge(amount) {
    return this.update('topLeft', (v) => v.update('x', (x) => x + amount));
  }

  moveRightEdge(amount) {
    return this.update('bottomRight', (v) => v.update('x', (x) => x + amount));
  }

  moveTopEdge(amount) {
    return this.update('topLeft', (v) => v.update('y', (y) => y + amount));
  }

  moveBottomEdge(amount) {
    return this.update('bottomRight', (v) => v.update('y', (y) => y + amount));
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
    // We only want to update the space that contains this point
    // as well as the spaces around it
    const spaceIndex = this.spaces.findIndex((sp) => sp.contains({x, y}));

    // nothing to do since the point isn't in any of the traversable space
    if (spaceIndex < 0) {
      return this;
    }

    const space = this.spaces.get(spaceIndex);

    // No matter where the given point is, we can resize
    // the containing space to fit it
    const resizedSpace = space.avoid({x, y});

    // If the space only had area 1 to begin with, resizing it will simply
    // remove the space entirely
    let spaces;
    if (resizedSpace === null) {
      //TODO: resize the adjacents of the original space to fill in any leftover traversable space from before this was removed
      spaces = this.spaces.remove(spaceIndex);
    }
    else {
      const adjacents = [];

      // TODO: resize the adjacents to fill in the extra traversable space
      // Adjacents can only be resized if they can be contained in
      // either the vertical or horizontal dimension of the *original*
      // space. i.e. spaces with mismatched dimensions cannot be used
      // here
      // Need to use the *original* space since these adjacents may not be
      // contained in the resized version

      // TODO: add new adjacents as necessary to fill in any leftovers

      spaces = this.spaces.set(spaceIndex,
        resizedSpace.set('adjacents', List.of(...adjacents)));
    }
    return this.set('spaces', spaces);;
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

