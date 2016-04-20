const {Range, Record} = require('immutable');

const SettingsRecord = Record({
  aiEnabled: false,
});

class Settings extends SettingsRecord {
}

module.exports = Settings;

