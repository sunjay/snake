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
}

module.exports = GameState;

