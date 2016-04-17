const {ARROW_KEYS} = require('./keys');
const {pressKey} = require('./actions');

const arrows = Array.from(ARROW_KEYS);

const dispatch = postMessage;

global.addEventListener('message', ({data}) => {
  console.log(data);
});

setInterval(() => {
  const key = arrows[Math.floor(arrows.length * Math.random())];
  dispatch(pressKey(key));
}, 200);

