const {Record} = require('immutable');

const SettingsRecord = Record({
  useAI: false,
  debugAIPath: false,
});

class Settings extends SettingsRecord {
  setAI(enabled) {
    return this.set('useAI', enabled);
  }

  setDebugAIPath(enabled) {
    return this.set('debugAIPath', enabled);
  }
}

module.exports = Settings;

