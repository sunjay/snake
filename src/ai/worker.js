const {snakeDirection, resetGame, enableAI} = require('../actions/actions');

const send = (action) => postMessage({
  ...action,
  source: 'ai',
});

self.addEventListener('message', ({data: action}) => {
});

//TODO: Sync the goal position

setInterval(() => {
}, 200);

