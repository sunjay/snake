const React = require('react');
const ReactDOM = require('react-dom');
const {Provider} = require('react-redux');
const {applyMiddleware, createStore} = require('redux');
const createLogger = require('redux-logger');
const thunk = require('redux-thunk').default;

const {ACTION_UPDATE} = require('./actions/actions');

const appReducer = require('./reducers/index');
const App = require('./components/App');

const {start: startMainloop} = require('./services/mainloop');
const {start: startKeyboardService} = require('./services/keyboard');

const logger = createLogger({
  predicate(getState, action) {
    // Avoid logging too many things
    return action.type !== ACTION_UPDATE;
  },
});
let store = createStore(
  appReducer,
  // logger must be last
  applyMiddleware(thunk, logger)
);

startMainloop(store);
startKeyboardService(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

// OLD
// const Grid = require('./grid');
// const Game = require('./game');
// const Renderer = require('./renderer');
// const {
//   resetGame,
//   snakeDirection,
//   ACTION_ENABLE_AI,
//   ACTION_KEY,
// } = require('./actions');
// const {render: renderControls, setupEventListeners} = require('./controls');
// 
// const {app} = require('../scss/index.scss');
// 
// const appContainer = document.getElementById('app');
// appContainer.classList.add(app);
// 
// const container = document.getElementById('game-container');
// 
// const AIWorker = require('worker!./worker');
// 
// const worker = new AIWorker();
// const dispatch = (...args) => worker.postMessage(...args);
// 
// let renderer;
// let store = {
//   game: null,
//   useAI: false,
// };
// reset();
// loop();
// 
// setupEventListeners({store, dispatch, reset});
// 
// function reset() {
//   dispatch(resetGame());
// 
//   while (container.firstChild) {
//     container.removeChild(container.firstChild);
//   }
// 
//   const grid = new Grid({rows: 30, cols: 30});
//   const game = new Game(grid);
//   store.game = game;
// 
//   renderer = new Renderer({
//     parent: container,
//     game: game,
//     width: 600, // px
//     height: 600, // px
//   });
// }
// 
// function loop() {
//   window.requestAnimationFrame(loop);
// 
//   store.game.update();
//   renderer.render();
// 
//   renderControls(store);
// }
// 
// worker.addEventListener('message', ({data: {type, ...action}}) => {
//   if (type === ACTION_KEY) {
//     store.game.handleKey(action.key);
//     dispatch(snakeDirection(store.game.snakeDirection));
//   }
//   else if (type === ACTION_ENABLE_AI) {
//     // Only updates the useAI property on update from the worker
//     // This is so the property change is acknowledged
//     store.useAI = action.enabled;
//   }
// });
// 
