const {Record} = require('immutable');

const SettingsRecord = Record({
  useAI: false,
});

class Settings extends SettingsRecord {
  setAI(enabled) {
    return this.set('useAI', enabled);
  }
}

module.exports = Settings;

