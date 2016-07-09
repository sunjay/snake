const {connect} = require('react-redux');

const SnakeGrid = require('../components/SnakeGrid');

const mapStateToProps = ({
  game,
  settings: {useAI, debugAIPath},
  ai: {plan: pathPlan},
}) => ({
  game,
  useAI,
  debugAIPath,
  pathPlan,
});

const Snake = connect(
  mapStateToProps
)(SnakeGrid)

module.exports = Snake;

