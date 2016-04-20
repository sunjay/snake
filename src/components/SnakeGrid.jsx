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

