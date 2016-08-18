const {createReducer} = require('./reducer');

const Vector = require('../models/vector');
const Direction = require('../models/direction');
const SnakeGame = require('../models/snakeGame');

const {
  ACTION_RESET,
  ACTION_DIRECTION,
  ACTION_UPDATE,
} = require('../actions/actions');

const initialState = SnakeGame.fromDimensions({rows: 30, cols: 30});
const game = createReducer(initialState, {
  [ACTION_RESET](state) {
    return initialState.placeRandomGoal();
  },
  [ACTION_DIRECTION](state, {name}) {
    const direction = Direction.toDirection(name);
    return state
      .update('snake', (snake) => snake.setDirection(direction))
      .update('status', (status) => {
        if (status.isReady) {
          return status.setRunning();
        }
        return status;
      });
  },
  [ACTION_UPDATE](state, {goal = {}}) {
    if (state.status.isRunning) {
      state = state.shift();
      if (state.isGoal(state.snake.head())) {
        state = state
          .update('snake', (snake) => snake.grow())
          .placeRandomGoal();
      }
    }

    // since null is a valid goal value, goal is only not set if an empty object is provided
    if (!goal || Object.keys(goal).length > 0) {
      state = state.set('goal', new Vector(goal));
    }

    return state.update('status', (status) => {
      if (state.snake.isWithinSelf()) {
        return status.setLost('bumped into yourself');
      }
      else if (state.isOutOfBounds(state.snake.head())) {
        return status.setLost('out of bounds');
      }
      else if (state.isFull) {
        return status.setWon();
      }
      return status;
    });
  },
});

module.exports = game;

