const {Record, List} = require('immutable');

const Turn = Record({
  // x and y to make this turn at
  x: undefined,
  y: undefined,
  // direction to turn in
  direction: undefined,
});

const PathPlanRecord = Record({
  // List of Turns
  nextDirections: List.of(),
});

class PathPlan extends PathPlanRecord {
  static Turn = Turn;

  hasPlan() {
    return !this.nextDirections.isEmpty();
  }

  // Adds a turn on the path where the snake should turn at the given position
  addTurn({x, y}, direction) {
    return this.update('nextDirections', (next) => next.push(
      new PathPlan.Turn({x, y, direction})
    ));
  }

  // Same as addTurn but appends to the front of the path
  prependTurn({x, y}, direction) {
    return this.update('nextDirections', (next) => next.unshift(
      new PathPlan.Turn({x, y, direction})
    ));
  }

  // Returns the next direction to turn and the position to turn at
  // i.e. The first turn in the planned path
  firstTurn() {
    return this.nextDirections.first();
  }

  // Removes the first turn in the planned path and
  // returns the new planned path
  shift() {
    return this.update('nextDirections', (next) => next.shift());
  }
}

module.exports = PathPlan;

