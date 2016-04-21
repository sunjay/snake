const {ACTION_DIRECTION, ACTION_ENABLE_AI} = require('../actions/actions');

export const start = ({dispatch}, worker) => {
  worker.addEventListener('message', ({data: action}) => {
    dispatch(action);
  });
};

export function createWorkerMiddleware(worker) {
  const send = (...args) => worker.postMessage(...args);

  return ({getState}) => next => action => {
    const useAI = getState().settings.useAI;
    if (action.source !== 'ai') {
      // Ignore directions while AI is enabled
      if (useAI && action.type === ACTION_DIRECTION) {
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

