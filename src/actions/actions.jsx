export const ACTION_RESET = 'reset';
export const ACTION_UPDATE = 'update';
export const ACTION_DIRECTION = 'direction';
export const ACTION_ENABLE_AI = 'ai-enabled';
export const ACTION_ENABLE_DEBUG_AI_PATH = 'ai-path-debug-enabled';
export const ACTION_UPDATE_PLANNED_PATH = 'update-planned-path';
export const ACTION_SHIFT_PLANNED_PATH = 'shift-planned-path';
export const ACTION_CLEAR_PLANNED_PATH = 'clear-planned-path';

export function resetGame() {
  return createAction(ACTION_RESET);
}

export function updateGame(goal = {}) {
  // the goal parameter manually overwrites the goal and is typically
  // used to tell the AI process what the goal should be whenever an update
  // is sent. This is a forced change that is applied AFTER the actual update
  // itself
  // NOTE: since null is a valid value for a goal, only an empty object
  // prevents the goal from being set
  return createAction(ACTION_UPDATE, {goal});
}

export function snakeDirection(directionName) {
  return createAction(ACTION_DIRECTION, {name: directionName});
}

export function enableAI(enabled = true) {
  return createAction(ACTION_ENABLE_AI, {enabled});
}

export function enableDebugAIPath(enabled = true) {
  return createAction(ACTION_ENABLE_DEBUG_AI_PATH, {enabled});
}

export function updatePlannedPath(path, target) {
  return createAction(ACTION_UPDATE_PLANNED_PATH, {path, target});
}

export function shiftPlannedPath() {
  return createAction(ACTION_SHIFT_PLANNED_PATH);
}

export function clearPlannedPath() {
  return createAction(ACTION_CLEAR_PLANNED_PATH);
}

function createAction(type, payload = {}) {
  return {
    type,
    ...payload,
  };
}

