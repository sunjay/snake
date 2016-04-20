const {connect} = require('react-redux');

const {enableAI, resetGame} = require('../actions/actions');

const ControlsBar = require('../components/ControlsBar');

const mapStateToProps = ({game: {snake}, settings: {useAI}}) => ({
  snakeSize: snake.length,
  useAI,
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

