export const ACTION_RESET = 'reset';
export const ACTION_KEY = 'key';
export const ACTION_ENABLE_AI = 'ai-enabled';

export function resetGame() {
  return createAction(ACTION_RESET);
}

export function pressKey(key) {
  return createAction(ACTION_KEY, {key});
}

export function enableAI(enabled = true) {
  return createAction(ACTION_ENABLE_AI, {enabled});
}

function createAction(type, payload = {}) {
  return {
    type,
    ...payload,
  };
}

