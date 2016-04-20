const {createReducer} = require('./reducer');

const Direction = require('../models/direction');
const SnakeGame = require('../models/snakeGame');

const {ACTION_RESET, ACTION_DIRECTION} = require('../actions/actions');

const initialState = SnakeGame.fromDimensions({rows: 30, cols: 30});
const game = createReducer(initialState, {
  [ACTION_RESET]() {
    return initialState.placeRandomGoal();
  },
  [ACTION_DIRECTION](state, {name}) {
    const direction = Direction.toDirection(name);
    return state.update('snake', (snake) => snake.setDirection(direction));
  },
});

module.exports = game;

