const {Range, Record} = require('immutable');

const SettingsRecord = Record({
  useAI: false,
});

class Settings extends SettingsRecord {
}

module.exports = Settings;

