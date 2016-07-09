const {Record, List} = require('immutable');

const Turn = Record({
  // y and x to make this turn at
  y: undefined,
  x: undefined,
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
  addTurn(y, x, direction) {
    return this.update('nextDirections', (next) => next.push(
      new PathPlan.Turn({y, x, direction})
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

