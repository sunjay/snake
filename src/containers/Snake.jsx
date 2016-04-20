const {connect} = require('react-redux');

const SnakeGrid = require('../components/SnakeGrid');

const mapStateToProps = ({game}) => ({
  game,
});

const Snake = connect(
  mapStateToProps
)(SnakeGrid)

module.exports = Snake;

