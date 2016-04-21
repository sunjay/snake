const {ACTION_ENABLE_AI} = require('../actions/actions');

export const start = ({dispatch}, worker) => {
  worker.addEventListener('message', ({data: action}) => {
    //TODO: delete this
    console.log('response', action);
    dispatch(action);
  });
};

export function createWorkerMiddleware(worker) {
  const send = (...args) => worker.postMessage(...args);

  return store => next => action => {
    if (action.source !== 'ai') {
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

