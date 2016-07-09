export const ACTION_RESET = 'reset';
export const ACTION_UPDATE = 'update';
export const ACTION_DIRECTION = 'direction';
export const ACTION_ENABLE_AI = 'ai-enabled';
export const ACTION_UPDATE_PLANNED_PATH = 'update-planned-path';
export const ACTION_SHIFT_PLANNED_PATH = 'shift-planned-path';

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

export function updatePlannedPath(path) {
  return createAction(ACTION_UPDATE_PLANNED_PATH, {path});
}

export function shiftPlannedPath() {
  return createAction(ACTION_SHIFT_PLANNED_PATH);
}

function createAction(type, payload = {}) {
  return {
    type,
    ...payload,
  };
}

