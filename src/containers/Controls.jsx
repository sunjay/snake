const {connect} = require('react-redux');

const {enableAI, resetGame} = require('../actions/actions');

const ControlsBar = require('../components/ControlsBar');

const mapStateToProps = ({
  game: {snake},
  settings: {useAI, debugAIPath}
}) => ({
  snakeSize: snake.length,
  useAI,
  debugAIPath,
});

const mapDispatchToProps = (dispatch) => ({
  onReset() {
    dispatch(resetGame());
  },
  onToggleAI(enabled) {
    dispatch(enableAI(enabled));
  },
});

const Controls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsBar)

module.exports = Controls;

