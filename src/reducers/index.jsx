const {combineReducers} = require('redux');

const game = require('./game');
const settings = require('./settings');

const app = combineReducers({
  game,
  settings,
});

module.exports = app;

