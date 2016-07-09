const {applyMiddleware, createStore} = require('redux');
const thunk = require('redux-thunk').default;

const appReducer = require('../reducers/index');

const {
  ACTION_ENABLE_AI,
  ACTION_UPDATE,
  enableAI,
  snakeDirection,
  updatePlannedPath,
  shiftPlannedPath,
} = require('../actions/actions');

const planner = require('./planner');

const send = (action) => postMessage({
  ...action,
  source: 'ai',
});

const store = createStore(
  appReducer,
  applyMiddleware(thunk)
);

self.addEventListener('message', ({data: action}) => {
  store.dispatch(action);

  const state = store.getState();
  const useAI = state.settings.useAI;
  const plan = state.ai;
  const game = state.game;
  const isRunning = game.status.isRunning;
  const head = game.snake.head();

  if (action.type === ACTION_ENABLE_AI) {
    send(enableAI(useAI));
  }

  if (action.type === ACTION_UPDATE && isRunning && useAI) {
    // Assumption: we will always hit the point in the plan
    // i.e. we can never accidentally skip an update and the AI will always
    // plan for squares we will actually hit
    console.log('going in direction', game.snake.direction.x, game.snake.direction.y);
    sendDirectionUpdate(head, plan);

    //TODO: Right now this happens on every update, but in reality
    // what should happen is that the AI should constantly be working
    // to calculate the path only pausing to process messages and update
    updateAIPath(game);
  }
});

/**
 * If the snake is at the next point on the planned path,
 * this will send a direction update for the next direction
 * and then shift the planned path
 */
function sendDirectionUpdate(head, plan) {
  if (!plan.hasPlan()) {
    return;
  }

  const {x, y, direction} = plan.firstTurn();
  console.log('head', head.x, head.y, 'next', x, y, 'direction', direction.x, direction.y);

  if (head.equals({x, y})) {
    console.log('turn', direction);
    // Note that store.dispatch isn't used here because we don't want to
    // change the direction on this side until it is acknowledged
    send(snakeDirection(direction));

    // This needs to be updated on both ends and will not be acknowledged
    store.dispatch(shiftPlannedPath());
    send(shiftPlannedPath());
  }
}

/**
 * Updates the planned path if necessary and sends that update
 */
function updateAIPath(game) {
  console.time('astar');
  const path = planner.planPathAStar(game);
  console.timeEnd('astar');

  // This needs to be updated on both ends and will not be acknowledged
  store.dispatch(updatePlannedPath(path));
  send(updatePlannedPath(path));
}

