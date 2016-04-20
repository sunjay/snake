const {createReducer} = require('./reducer');

const SnakeGame = require('../models/snakeGame');

const {ACTION_RESET} = require('../actions/actions');

const initialState = SnakeGame.fromDimensions({rows: 30, cols: 30});
const game = createReducer(initialState, {
  [ACTION_RESET]() {
    return initialState.placeRandomGoal();
  },
});

module.exports = game;

