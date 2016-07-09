const PathPlan = require('../models/pathPlan');

/**
 * Returns a PathPlan to get from the position after the current one
 * to the next goal
 * Returns an empty path if there is no path to the goal (about to die)
 */
export function planPathAStar(game) {
  // Need to start on the position *after* the current one because
  // at this point the snake is already moving there, there is nothing
  // to be gained by searching other directions from the current position
  
  return new PathPlan();
}

