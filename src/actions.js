export const ACTION_RESET = 'reset';
export const ACTION_KEY = 'key';

export function resetGame() {
  return createAction(ACTION_RESET);
}

export function pressKey(key) {
  return createAction(ACTION_KEY, {key});
}

function createAction(type, payload = {}) {
  return {
    type,
    ...payload,
  };
}

