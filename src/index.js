const Grid = require('./grid');
const Game = require('./game');
const Renderer = require('./renderer');
const {KEYS} = require('./keys');
const {resetGame, enableAI, ACTION_ENABLE_AI, ACTION_KEY} = require('./actions');

const {app} = require('../scss/index.scss');

const appContainer = document.getElementById('app');
appContainer.classList.add(app);

const container = document.getElementById('game-container');
const snakeLength = document.getElementById('snake-length');
const aiEnabled = document.getElementById('ai');

const AIWorker = require('worker!./worker');

const worker = new AIWorker();
const dispatch = (...args) => worker.postMessage(...args);

let game, renderer, useAI = false;
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
  aiEnabled.textContent = `${useAI ? 'on' : 'off'}`;
}

worker.addEventListener('message', ({data: {type, ...action}}) => {
  if (type === ACTION_KEY) {
    game.handleKey(action.key);
  }
  else if (type === ACTION_ENABLE_AI) {
    useAI = action.enabled;
  }
});

document.addEventListener('keydown', (event) => {
    const key = event.width || event.keyCode;
    if (key === KEYS.R) { // r
      reset();
      return;
    }
    else if (key === KEYS.A) { // a
      dispatch(enableAI(!useAI));
      return;
    }
    else if (!useAI) {
      game.handleKey(key);
    }
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});

document.getElementById('toggle-ai').addEventListener('click', () => {
  dispatch(enableAI(!useAI));
});

