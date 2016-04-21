const {ARROW_KEYS} = require('./keys');
const Vector = require('./vector');

const {
  pressKey,
  enableAI,
  ACTION_ENABLE_AI,
  ACTION_DIRECTION,
  ACTION_RESET,
} = require('./actions');

const dispatch = postMessage;

const arrows = Array.from(ARROW_KEYS);

let store = {
  game: null,
  enabled: false,
};

function reset() {
  const grid = new Grid({rows: 30, cols: 30});
  const game = new Game(grid);
  store.game = game;
}

self.addEventListener('message', ({data: {type, ...action}}) => {
  if (type === ACTION_ENABLE_AI) {
    store.enabled = action.enabled;
    dispatch(enableAI(store.enabled));
  }
  else if (type === ACTION_DIRECTION) {
    const direction = new Vector(action.direction);
    //TODO: Set property on game with setDirection
  }
  //else if (type === ACTION_SHIFT) {
  //  game.shift();
  //}
  else if (type === ACTION_RESET) {
    //reset();
  }
});

setInterval(() => {
  if (store.enabled) {
    const key = arrows[Math.floor(arrows.length * Math.random())];
    dispatch(pressKey(key));
  }
}, 200);

