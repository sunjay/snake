const {createReducer} = require('./reducer');

const SnakeGame = require('../models/snakeGame');

const initialState = SnakeGame.fromDimensions({rows: 30, cols: 30});
const game = createReducer(initialState, {
});

module.exports = game;

