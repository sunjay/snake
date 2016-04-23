export const ACTION_RESET = 'reset';
export const ACTION_UPDATE = 'update';
export const ACTION_DIRECTION = 'direction';
export const ACTION_ENABLE_AI = 'ai-enabled';

export function resetGame() {
  return createAction(ACTION_RESET, {
    seed: Math.floor(Math.random() * 100000),
  });
}

export function updateGame() {
  return createAction(ACTION_UPDATE);
}

export function snakeDirection(directionName) {
  return createAction(ACTION_DIRECTION, {name: directionName});
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

