const {applyMiddleware, createStore} = require('redux');
const thunk = require('redux-thunk').default;
const debounce = require('lodash.debounce');

const appReducer = require('../reducers/index');

const {
  ACTION_ENABLE_AI,
  ACTION_UPDATE,
  enableAI,
  snakeDirection,
  updatePlannedPath,
  shiftPlannedPath,
  clearPlannedPath,
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

const actionQueue = [];

const flushActions = debounce(() => {
  console.log('flushing', actionQueue.length, 'actions');

  for (let [i, action] of actionQueue.entries()) {
    store.dispatch(action);

    const state = store.getState();
    const useAI = state.settings.useAI;

    // Enable AI needs to be acknowledged
    if (action.type === ACTION_ENABLE_AI) {
      send(enableAI(useAI));

      store.dispatch(clearPlannedPath());
      send(clearPlannedPath());
    }

    const plan = state.ai.plan;
    const plannedTarget = state.ai.target;
    const game = state.game;
    const isRunning = game.status.isRunning;
    const head = game.snake.head();

    if (action.type === ACTION_UPDATE && isRunning && useAI) {
      if (i !== actionQueue.length - 1) {
        // If we got to a goal or if we clearly missed a target turn,
        // the entire path needs to be replanned
        if (!game.goal.equals(plannedTarget) || head.equals(plan.firstTurn())) {
          console.log('replanning path');
          store.dispatch(clearPlannedPath());
          send(clearPlannedPath());
        }
      }
      // reached last action
      else {
        // No longer assuming that we always hit the planned path
        // Any latency is accounted for by clearing the path on multiple
        // updates
        sendDirectionUpdate(head, plan);

        //TODO: Right now this happens on every update, but in reality
        // what should happen is that the AI should constantly be working
        // to calculate the path only pausing to process messages and update
        if (!game.goal.equals(plannedTarget)) {
          updateAIPath(game);
        }
      }
    }
  }

  actionQueue.splice(0, actionQueue.length);
}, 5);

self.addEventListener('message', ({data: action}) => {
  actionQueue.push(action);
  flushActions();
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

  if (head.equals({x, y})) {
    // We just fire and forget here with no hope of acknowledgement
    store.dispatch(snakeDirection(direction));
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
  store.dispatch(updatePlannedPath(path.toJSON(), game.goal.toJSON()));
  send(updatePlannedPath(path.toJSON(), game.goal.toJSON()));
}

