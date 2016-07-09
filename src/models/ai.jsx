const {Record} = require('immutable');

const AIRecord = Record({
  plan: undefined,
  // the target this plan was made for
  target: {},
});

class AI extends AIRecord {
  setPlan(plan) {
    return this.set('plan', plan);
  }

  setTarget(target) {
    return this.set('target', target);
  }
}

module.exports = AI;

