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

setInterval(() => {
  if (store.getState().settings.useAI) {
  }
}, 200);

