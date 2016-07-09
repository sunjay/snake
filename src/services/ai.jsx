const {ACTION_DIRECTION, ACTION_ENABLE_AI} = require('../actions/actions');

export const start = ({dispatch}, worker) => {
  worker.addEventListener('message', ({data: action}) => {
    dispatch(action);
  });
};

export function createWorkerMiddleware(worker) {
  const send = (...args) => worker.postMessage(...args);

  return ({getState, dispatch}) => next => action => {
    const state = getState();
    const useAI = state.settings.useAI;
    const isRunning = state.game.status.isRunning;

    if (action.source !== 'ai') {
      // Ignore directions while AI is enabled
      // Only ignore keys so long as the game is already running
      // This is so that the game can still be started while AI is on
      if (useAI && action.type === ACTION_DIRECTION && isRunning) {
        return;
      }

      // Forward all actions to the AI so it can stay in sync
      send(action);

      // For enabling the AI, wait for a response first
      // before dispatching this
      if (action.type === ACTION_ENABLE_AI) {
        return;
      }
    }

    return next(action);
  }; 
}

