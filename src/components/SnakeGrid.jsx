const React = require('react');
const ReactDOM = require('react-dom');

const Canvas = require('../renderers/canvas');
const {renderGame} = require('../renderers/gameRenderer');

const SnakeGrid = React.createClass({
  propTypes: {
    game: React.PropTypes.object.isRequired,
  },

  componentDidMount() {
    this.draw();
  },

  shouldComponentUpdate(nextProps) {
    // Trick to check if only the direction changed
    // since update isn't necessary if that is the only change
    return !nextProps.game.update('snake', (snake) => {
      return snake.set('direction', this.props.game.snake.direction);
    }).equals(this.props.game);
  },

  componentDidUpdate() {
    this.draw();
  },

  draw() {
    const canvas = new Canvas(ReactDOM.findDOMNode(this.refs.canvas));
    renderGame(canvas, {game: this.props.game});
  },

  render() {
    return (
      <canvas ref='canvas' width={600} height={600} />
    );
  },
});

module.exports = SnakeGrid;

