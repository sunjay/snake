const React = require('react');

const ControlsBar = ({
  aiEnabled,
  snakeLength,
  onReset = () => {},
  onToggleAI = () => {},
}) => (
  <div>
    <button onClick={onReset}>Reset</button>
    (Press <kbd>r</kbd>)
    &nbsp;
    &nbsp;
    AI: {aiEnabled ? 'on' : 'off'}
    <button onClick={() => onToggleAI(!aiEnabled)}>Toggle</button>
    (Press <kbd>a</kbd>)
    <div class='pull-right'>{snakeLength}</div>
    &emsp;
    <span class='pull-right'>Move: <kbd>&#8592;</kbd><kbd>&#8593;</kbd><kbd>&#8594;</kbd><kbd>&#8595;</kbd></span>
  </div>
);

ControlsBar.propTypes = {
  aiEnabled: React.PropTypes.bool,
  snakeLength: React.PropTypes.number,
  onReset: React.PropTypes.func,
  onToggleAI: React.PropTypes.func,
};

module.exports = ControlsBar;

