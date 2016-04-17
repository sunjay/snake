const {KEYS} = require('./keys');
const {enableAI} = require('./actions');

const snakeLength = document.getElementById('snake-length');
const aiEnabled = document.getElementById('ai');

export function render({game, useAI}) {
  snakeLength.textContent = `Length: ${game.snakeSize}`;
  aiEnabled.textContent = `${useAI ? 'on' : 'off'}`;
}

export function setupEventListeners({store, dispatch, reset}) {
  document.addEventListener('keydown', (event) => {
    const key = event.width || event.keyCode;
    if (key === KEYS.R) { // r
      reset();
      return;
    }
    else if (key === KEYS.A) { // a
      dispatch(enableAI(!store.useAI));
      return;
    }
    else if (!store.useAI) {
      store.game.handleKey(key);
    }
  });

  document.getElementById('reset').addEventListener('click', () => {
    reset();
  });

  document.getElementById('toggle-ai').addEventListener('click', () => {
    dispatch(enableAI(!store.useAI));
  });
}

