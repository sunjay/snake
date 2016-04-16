const {GameLost} = require('./exceptions');
const Direction = require('./direction');

class Game {
  static GAME_READY = 'ready';
  static GAME_RUNNING = 'running';
  static GAME_WON = 'won';
  static GAME_LOST = 'lost';

  constructor(grid) {
    this.grid = grid;
    this.state = Game.GAME_READY;
    this.stateMessage = '';
  }

  get snakeSize() {
    return this.grid.snake.size;
  }

  handleKey(key) {
    if (!Game.isRunning(this.state)) {
      return;
    }

    let direction = null;
    if (key === 38) { // UP
      direction = Direction.N;
    }
    else if (key === 39) { // RIGHT
      direction = Direction.E;
    }
    else if (key === 37) { // LEFT
      direction = Direction.W;
    }
    else if (key === 40) { // DOWN
      direction = Direction.S;
    }

    if (direction && this.grid.snake.canTravelInDirection(direction)) {
      this.grid.snake.setDirection(direction);
    }
  }

  update() {
    if (!Game.isRunning(this.state)) {
      return;
    }

    try {
      this.grid.update();
    }
    catch (error) {
      if (error instanceof GameLost) {
        this.finishGame(error);
        return;
      }
      else {
        throw error;
      }
    }

    if (this.grid.isFull) {
      this.finishGame();
    }
  }

  /**
   * Finishes the game. If an error is provided,
   * the game is lost and the error's message is
   * used as the failure message
   * If nothing is provided, the game is won
   */
  finishGame(error = null) {
    if (!error) {
      this.state = Game.GAME_WON;
      this.stateMessage = 'you did it';
    }
    else {
      this.state = Game.GAME_LOST;
      this.stateMessage = error.message;
    }
  }

  render() {
    return {
      state: this.state,
      message: this.stateMessage,
      grid: this.grid.render(),
    };
  }

  static isReady(state) {
    return state === this.GAME_READY;
  }

  static isRunning(state) {
    return state === this.GAME_RUNNING;
  }

  static isWon(state) {
    return state === this.GAME_WON;
  }

  static isLost(state) {
    return state === this.GAME_LOST;
  }
}

module.exports = Game;

