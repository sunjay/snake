const {snakeDirection, resetGame, enableAI, enableDebugAIPath} = require('../actions/actions');
const {NORTH, SOUTH, EAST, WEST} = require('../models/direction');

const KEYS = {
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  LEFT_ARROW: 37,
  DOWN_ARROW: 40,
  R: 82,
  A: 65,
  PERIOD: 190,
};

//TODO: If AI is enabled start on any key that is not an existing action
//TODO: Change the start message to Press any key to begin when AI enabled
//TODO: Note: Direction actions are ignored in the ai service
const keyActions = {
  [KEYS.UP_ARROW]: () => snakeDirection(NORTH),
  [KEYS.RIGHT_ARROW]: () => snakeDirection(EAST),
  [KEYS.LEFT_ARROW]: () => snakeDirection(WEST),
  [KEYS.DOWN_ARROW]: () => snakeDirection(SOUTH),
  [KEYS.R]: () => resetGame(),
  [KEYS.A]: () => (dispatch, getState) => dispatch(enableAI(!getState().settings.useAI)),
  [KEYS.PERIOD]: () => (dispatch, getState) => dispatch(enableDebugAIPath(!getState().settings.debugAIPath))
};

export const start = ({dispatch}) => {
  document.addEventListener('keydown', (event) => {
    const key = event.width || event.keyCode;
    const getAction = keyActions[key];
    const action = getAction && getAction();
    if (action) {
      dispatch(action);
    }
  });
};

