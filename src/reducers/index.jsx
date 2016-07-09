const {combineReducers} = require('redux');

const game = require('./game');
const ai = require('./ai');
const settings = require('./settings');

const app = combineReducers({
  game,
  ai,
  settings,
});

module.exports = app;

