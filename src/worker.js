const {ARROW_KEYS} = require('./keys');
const {pressKey, enableAI, ACTION_ENABLE_AI} = require('./actions');

const arrows = Array.from(ARROW_KEYS);

const dispatch = postMessage;

let enabled = false;

global.addEventListener('message', ({data: {type, ...action}}) => {
  if (type === ACTION_ENABLE_AI) {
    enabled = action.enabled;
    dispatch(enableAI(enabled));
  }
});

setInterval(() => {
  if (enabled) {
    const key = arrows[Math.floor(arrows.length * Math.random())];
    dispatch(pressKey(key));
  }
}, 200);

