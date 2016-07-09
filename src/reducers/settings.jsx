const {createReducer} = require('./reducer');

const Settings = require('../models/settings');

const {ACTION_ENABLE_AI, ACTION_ENABLE_DEBUG_AI_PATH} = require('../actions/actions');

const settings = createReducer(new Settings(), {
  [ACTION_ENABLE_AI](state, {enabled}) {
    return state.setAI(enabled);
  },
  [ACTION_ENABLE_DEBUG_AI_PATH](state, {enabled}) {
    return state.setDebugAIPath(enabled);
  },
});

module.exports = settings;

