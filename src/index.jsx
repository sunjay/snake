const React = require('react');
const ReactDOM = require('react-dom');
const {Provider} = require('react-redux');
const {applyMiddleware, createStore} = require('redux');
const createLogger = require('redux-logger');
const thunk = require('redux-thunk').default;

const {
  ACTION_UPDATE,
  ACTION_UPDATE_PLANNED_PATH,
  resetGame,
} = require('./actions/actions');

const appReducer = require('./reducers/index');
const App = require('./components/App');

const AIWorker = require('worker!./ai/worker');

const {start: startMainloop} = require('./services/mainloop');
const {start: startKeyboardService} = require('./services/keyboard');
const {start: startAI, createWorkerMiddleware} = require('./services/ai');

const worker = new AIWorker();

const logger = createLogger({
  predicate(getState, action) {
    // Avoid logging too many things
    return action.type !== ACTION_UPDATE
      && action.type !== ACTION_UPDATE_PLANNED_PATH;
  },
});
const workerMiddleware = createWorkerMiddleware(worker);

const store = createStore(
  appReducer,
  // logger must be last
  applyMiddleware(
    thunk,
    workerMiddleware,
    logger
  )
);

startMainloop(store);
startKeyboardService(store);
startAI(store, worker);

store.dispatch(resetGame());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

