const {combineReducers} = require('redux');

const game = require('./game');

const app = combineReducers({
  game,
});

module.exports = app;

