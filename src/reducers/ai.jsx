const {createReducer} = require('./reducer');

const PathPlan = require('../models/pathPlan');

const {
  ACTION_RESET,
  ACTION_UPDATE_PLANNED_PATH,
  ACTION_SHIFT_PLANNED_PATH,
} = require('../actions/actions');

const initialState = new PathPlan();
const game = createReducer(initialState, {
  [ACTION_RESET]() {
    return initialState;
  },
  [ACTION_UPDATE_PLANNED_PATH](_, {path}) {
    return path;
  },
  [ACTION_SHIFT_PLANNED_PATH](state) {
    return state.shift();
  },
});

module.exports = game;

