const {Record, List} = require('immutable');

const Vector = require('./vector');
const Direction = require('./direction');

const SpaceRecord = Record({
  topLeft: undefined,
  bottomRight: undefined,
  // adjacent spaces
  adjacents: List.of(),
});

class Space extends SpaceRecord {
  static fromCorners(a, b) {
    const [min, max] = (b.x > a.x && b.y > a.y) ? [a, b] : [b, a];
  }

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

  verticies() {
    return List.of(
      this.topLeft,
      new Vector({x: this.bottomRight.x, y: this.topLeft.y}),
      this.bottomRight,
      new Vector({x: this.topLeft.x, y: this.bottomRight.y}),
    );
  }

  contains({x, y}) {
    return (
      x >= this.topLeft.x && x <= this.bottomRight.x &&
      y >= this.topLeft.y && y <= this.bottomRight.y
    );
  }

  /**
   * Returns the distance BETWEEN the edges of this space and another
   * Assumes that other is on only ONE side of this
   * i.e. other isn't far above AND to the right of this, it is one or
   * the other
   * Assumes that spaces never intersect (they don't)
   *
   * Example:
   *   A           AA     C      CCD
   *      BB     BB       DD
   *   A is on multiple sides of B, C is only on one side of D
   */
  distanceBetween(other) {
    // Note: This could potentially be done without all the cases:
    // Just compute all the differences and find the one that isn't negative

    // this is to the left of other
    if (this.bottomRight.x < other.topLeft.x) {
      return other.topLeft.x - this.bottomRight.x;
    }
    // this is above other
    else if (this.bottomRight.y < other.topLeft.y) {
      return other.topLeft.y - this.bottomRight.y;
    }
    // this is to the right of other
    else if (this.topLeft.x > other.bottomRight.x) {
      return this.topLeft.x - other.bottomRight.x;
    }
    // this is below other
    else if (this.topLeft.y > other.bottomRight.y) {
      return this.topLeft.y - other.bottomRight.y;
    }
    else {
      throw new Error('unsupported case for distanceBetween');
    }
  }

  /**
   * Returns true if the given other space is within either
   * dimension of this space geometrically
   * That is, this function returns whether shifting other either
   * only vertically or only horizontally could result in it moving
   * into the area of this space
   */
  dimensionsContain(other) {
    return (
      other.topLeft.x >= this.topLeft.x && other.bottomRight.x <= this.bottomRight.x
    ) || (
      other.topLeft.y >= this.topLeft.y && other.bottomRight.y <= this.bottomRight.y
    );
  }

  /**
   * Returns a space that represents the difference in area on the grid
   * between this space and another. other is assumed to be within
   * this and the difference must be representable by a single space
   *  ------- ----------   C = A + B
   * |       |          |
   * |   A   |    B     |
   * |       |          |
   *  ------- ----------
   * 
   * C is the shape surrounding A and B.
   * The difference between C and A is B. (C - A = B)
   * This function will return B given C (this) and A (other).
   * 
   * Intended for use right after avoid(), if other is null, returns this
   */
  difference(other) {
    if (other === null) {
      return this;
    }

    // The +1/-1 throughout this code is there to avoid overlap

    // when other is on the left side of this
    else if (other.bottomRight.x < this.bottomRight.x) {
      // return the right side
      return new Space({
        topLeft: new Vector({x: other.bottomRight.x + 1, y: other.topLeft.y}),
        bottomRight: this.bottomRight,
      });
    }

    // when other is on the right side of this
    else if (other.topLeft.x > this.topLeft.x) {
      // return the left side
      return new Space({
        topLeft: this.topLeft,
        bottomRight: new Vector({x: other.topLeft.x - 1, y: other.bottomRight.y}),
      });
    }

    // when other is at the top of this
    else if (other.bottomRight.y < this.bottomRight.y) {
      // return the bottom side
      return new Space({
        topLeft: new Vector({x: other.topLeft.x, y: other.bottomRight.y + 1}),
        bottomRight: this.bottomRight,
      });
    }

    // when other is at the bottom of this
    else if (other.topLeft.y > this.topLeft.y) {
      // return the top side
      return new Space({
        topLeft: this.topLeft,
        bottomRight: new Vector({x: other.bottomRight.x, y: other.topLeft.y - 1}),
      });
    }

    else {
      // note that the case when both spaces are the same area is not
      // supported
      throw new Error('Unsupported case of difference');
    }
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
    // If the space only had area 1 to begin with, resizing it will simply
    // remove the space entirely (i.e. return null)
    const resizedSpace = space.avoid({x, y});

    // Need to resize adjacents into this difference or create
    // new spaces that occupy this difference
    const difference = space.difference(resizedSpace);

    // The newly filled point is beside resizedSpace, so we can go around
    // it in 4 directions and create up to 3 subspaces within the difference
    // These subspaces give us the targets we need to occupy with the
    // existing adjacents or new spaces
    const vertices = difference.verticies();
    const subspaces = [];
    for (let direction of Direction.all()) {
      const corner = direction.add({x, y});
      if (resizedSpace.contains(corner)) {
        continue;
      }
      const possible = vertices.map((v) => null /*TODO*/);
    }

    // Adjacents can only be resized if they can be contained in
    // either the vertical or horizontal dimension of the *original*
    // space. i.e. spaces with mismatched dimensions cannot be used
    // here
    // Need to use the *original* space since these adjacents may not be
    // contained in the resized version
    const adjacents = [];
    const unchanged = [];
    for (let adj of space.adjacents) {
      const distance = resizedSpace.distanceBetween(adj);

      if (distance >= 0) {
        if (!space.dimensionsContain(adj)) {
          unchanged.push(adj);
          continue;
        }

        //TODO
      }

      adjacents.push(adj);
    }

    // TODO: add new adjacents as necessary to fill in any leftovers
    const added = [];
    added.push(difference);

    let spaces;
    if (resizedSpace === null) {
      spaces = this.spaces.remove(spaceIndex);
    }
    else {
      spaces = this.spaces.set(spaceIndex,
        resizedSpace.set('adjacents', List.of(...adjacents)));
    }

    return this.set('spaces', spaces.concat(added));;
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

