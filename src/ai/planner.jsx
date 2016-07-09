const Direction = require('../models/direction');
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
  game = game.update('snake', (snake) => snake.shift());

  const finish = game.goal;

  const open = [createAStarNode(game, null, null, finish)];
  const visited = new Set();

  while (open.length) {
    const current = open.splice(0, 1)[0];
    visited.add(current.id);

    const position = current.game.snake.head();

    if (position.equals(finish)) {
      return solutionPathFromAStar(current);
    }

    for (let {adjacent, direction} of availableAdjacents(current.game)) {
      if (visited.has(adjacent.hash())) {
        continue;
      }

      // Change directions AND shift so that the snake moves in this
      // direction
      const adjGame = current.game.update('snake',
        (snake) => snake.setDirection(direction).shift());
      const adjNode = createAStarNode(adjGame, current, direction, finish);

      // Skip a potential node with a lower cost
      var sameOpen = open.findIndex((n) => n.id === adjNode.id);
      if (sameOpen > -1) {
        if (open[sameOpen].cost < adjNode.cost) {
          continue;
        }
        else {
          // Remove sameOpen since its cost is higher than this path
          open.splice(sameOpen, 1);
        }
      }

      insertAStarNodeByCost(open, adjNode);
    }
  }
  
  // exhausted search
  console.debug('exhausted search for goal, giving up');
  return new PathPlan();
}

function createAStarNode(game, parent, direction, finish) {
  const position = game.snake.head();

  let total = 0;
  if (parent) {
    const parentPosition = parent.game.snake.head();
    total = parent.totalCost + parentPosition.squaredDistanceTo(position);
  }

  const estimate = position.squaredDistanceTo(finish);

  // Very basic heuristic for determining if this path will lead to a
  // dead end. A more advanced method would be to look ahead from the
  // finish and see if there are alternate paths afterwards
  // The advanced method should lookahead at least the number of spaces
  // the snake will grow to see if it hits something
  let extra = 0;
  if (position.equals(game.goal)) {
    const afterGoal = position.add(game.snake.direction);
    if (game.isSnake(afterGoal) || game.isOutOfBounds(afterGoal)) {
      // this extra cost will influence the snake to avoid these conditions
      // but also still not exhaust the search if this is the only option
      // Needs to be at least the square of the distance from corner to corner
      extra += 5000;
    }

    const twoAfterGoal = afterGoal.add(game.snake.direction);
    if (game.isSnake(twoAfterGoal) || game.isOutOfBounds(twoAfterGoal)) {
      extra += 4000;
    }
  }

  return {
    id: position.hash(),
    game: game,
    // the direction leading to this game
    direction: direction,
    parent: parent,
    cost: total + estimate + extra,
    // total distance up to this position from the start
    totalCost: total,
    estimatedCost: estimate,
  };
}

/* Simplifies the path starting from the finish
 * to only contain the turns necessary to go through
 * that path
 */
function solutionPathFromAStar(finishNode) {
  //TODO: Some bug here causes finishNode.direction to be null sometimes
  let path = new PathPlan();

  // Note that the direction property is the direction leading
  // **into** the node 

  let currentDirection = finishNode.direction;
  let current = finishNode;
  while (current.direction) {
    // Looking for where this direction started
    // Where ever the direction changes, that's where this direction
    // started
    if (!current.direction.equals(currentDirection)) {
      const position = current.game.snake.head();
      path = path.prependTurn(position, Direction.toName(currentDirection));

      currentDirection = current.direction;
    }

    current = current.parent;
  }

  // once we reach the start node, we'll have a current position
  // but no current direction - this needs to be prepended too
  const position = current.game.snake.head();
  path = path.prependTurn(position, Direction.toName(currentDirection));

  return path;
}

function insertAStarNodeByCost(open, node) {
  // attempt to insert the node before a node with a larger cost
  for (let [i, openNode] of open.entries()) {
    // Since this is >= and not >, nodes with the same cost but
    // checked earlier will be searched afterwards
    if (openNode.cost >= node.cost) {
      open.splice(i, 0, node);
      return;
    }
  }

  // never found any node with a smaller cost
  open.push(node);
}

/**
 * Yields each adjacent that is not a snake tile or out of bounds
 */
function* availableAdjacents(game) {
  const position = game.snake.head();
  const backwards = game.snake.direction.negate();

  for (let direction of Direction.all()) {
    // Since it is impossible to move backwards
    if (direction.equals(backwards)) {
      continue;
    }

    const adjacent = position.add(direction);

    if (game.isOutOfBounds(adjacent) || game.isSnake(adjacent)) {
      continue;
    }

    yield {adjacent, direction};
  }
}

