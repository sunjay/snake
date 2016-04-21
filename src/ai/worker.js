const {applyMiddleware, createStore} = require('redux');
const thunk = require('redux-thunk').default;

const appReducer = require('../reducers/index');

const {ACTION_ENABLE_AI, enableAI} = require('../actions/actions');

const send = (action) => postMessage({
  ...action,
  source: 'ai',
});

//TODO: Sync the goal position
const store = createStore(
  appReducer,
  applyMiddleware(thunk)
);

self.addEventListener('message', ({data: action}) => {
  store.dispatch(action);

  if (action.type === ACTION_ENABLE_AI) {
    send(enableAI(store.getState().settings.useAI));
  }
});

//TODO: Delete this Sample random AI
const {NORTH, SOUTH, EAST, WEST} = require('../models/direction');
const {snakeDirection} = require('../actions/actions');
setInterval(() => {
  if (store.getState().settings.useAI) {
    const directions = [NORTH, SOUTH, EAST, WEST];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    send(snakeDirection(direction));
  }
}, 200);

