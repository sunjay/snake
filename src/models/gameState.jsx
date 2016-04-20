const {Range, Record} = require('immutable');

const READY = 'ready';
const RUNNING = 'running';
const WON = 'won';
const LOST = 'lost';

const GameStateRecord = Record({
  state: READY,
  message: '',
});

class GameState extends GameStateRecord {
  get isReady() {
    return this.state === READY;
  }

  get isRunning() {
    return this.state === RUNNING;
  }

  get isWon() {
    return this.state === WON;
  }

  get isLost() {
    return this.state === LOST;
  }
}

module.exports = GameState;

