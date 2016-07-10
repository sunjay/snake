const {createReducer} = require('./reducer');

const AI = require('../models/ai');
const PathPlan = require('../models/pathPlan');

const {
  ACTION_RESET,
  ACTION_UPDATE_PLANNED_PATH,
  ACTION_SHIFT_PLANNED_PATH,
  ACTION_CLEAR_PLANNED_PATH,
} = require('../actions/actions');

const initialState = new AI({plan: new PathPlan()});
const game = createReducer(initialState, {
  [ACTION_RESET]() {
    return initialState;
  },
  [ACTION_CLEAR_PLANNED_PATH](state) {
    return initialState;
  },
  [ACTION_UPDATE_PLANNED_PATH](state, {path, target}) {
    return state.setPlan(PathPlan.fromJSON(path)).setTarget(target);
  },
  [ACTION_SHIFT_PLANNED_PATH](state) {
    return state.update('plan', (plan) => plan.shift());
  },
});

module.exports = game;

