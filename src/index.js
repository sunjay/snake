const Grid = require('./grid');
const Game = require('./game');
const Renderer = require('./renderer');
const {KEYS} = require('./keys');
const {resetGame, ACTION_KEY} = require('./actions');

const {app} = require('../scss/index.scss');

const appContainer = document.getElementById('app');
appContainer.classList.add(app);

const container = document.getElementById('game-container');
const snakeLength = document.getElementById('snake-length');

const AIWorker = require('worker!./worker');

const worker = new AIWorker();
const dispatch = (...args) => worker.postMessage(...args);

let game, renderer;
reset();
loop();

function reset() {
  dispatch(resetGame());

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const grid = new Grid({rows: 30, cols: 30});
  game = new Game(grid);

  renderer = new Renderer({
    parent: container,
    game: game,
    width: 600, // px
    height: 600, // px
  });
}

function loop() {
  window.requestAnimationFrame(loop);

  game.update();
  renderer.render();

  snakeLength.textContent = `Length: ${game.snakeSize}`;
}

worker.addEventListener('message', ({data: {type, key}}) => {
  if (type === ACTION_KEY) {
    game.handleKey(key);
  }
});

document.addEventListener('keydown', (event) => {
    const key = event.width || event.keyCode;
    if (key === KEYS.R) { // r
      reset();
      return;
    }
    game.handleKey(key);
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});

