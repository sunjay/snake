const {createReducer} = require('./reducer');

const Settings = require('../models/settings');

const settings = createReducer(new Settings(), {
});

module.exports = settings;

