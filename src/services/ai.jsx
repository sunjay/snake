const {
  ACTION_DIRECTION,
  ACTION_ENABLE_AI,
  ACTION_UPDATE,
  updateGame,
} = require('../actions/actions');

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

      if (action.type == ACTION_UPDATE) {
        // completely custom behaviour on update because we need to send
        // an accurate goal every update
        // That means the main process update needs to occur first
        const result = next(action);

        // Then the now up to date goal needs to be sent
        const goal = getState().game.goal;
        send(updateGame(goal ? goal.toJSON() : goal));

        // Then the result needs to be returned as normal
        return result;
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

