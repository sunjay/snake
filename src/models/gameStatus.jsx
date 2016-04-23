const {Record} = require('immutable');

const READY = 'ready';
const RUNNING = 'running';
const WON = 'won';
const LOST = 'lost';

const GameStatusRecord = Record({
  status: READY,
  message: '',
});

class GameStatus extends GameStatusRecord {
  setReady() {
    return this.set('status', READY).set('message', '');
  }

  setRunning() {
    return this.set('status', RUNNING).set('message', '');
  }

  setWon() {
    return this.set('status', WON).set('message', '');
  }

  setLost(message) {
    return this.set('status', LOST).set('message', message);
  }

  get isReady() {
    return this.status === READY;
  }

  get isRunning() {
    return this.status === RUNNING;
  }

  get isWon() {
    return this.status === WON;
  }

  get isLost() {
    return this.status === LOST;
  }
}

module.exports = GameStatus;

