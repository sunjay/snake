const {createReducer} = require('./reducer');

const Settings = require('../models/settings');

const {ACTION_ENABLE_AI} = require('../actions/actions');

const settings = createReducer(new Settings(), {
  [ACTION_ENABLE_AI](state, {enabled}) {
    return state.setAI(enabled);
  },
});

module.exports = settings;

