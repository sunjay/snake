const React = require('react');

const ControlsBar = ({
  useAI,
  snakeSize,
  onReset = () => {},
  onToggleAI = () => {},
}) => (
  <div>
    <button onClick={onReset}>Reset</button> (Press <kbd>r</kbd>)
    &nbsp;
    &nbsp;
    AI: {useAI ? 'on' : 'off'}
    &nbsp;
    <button onClick={() => onToggleAI(!useAI)}>Toggle</button>
    &nbsp;
    (Press <kbd>a</kbd>)
    <div className='pull-right'>&emsp;Length: {snakeSize}</div>
    &emsp;
    <span className='pull-right'>Move: <kbd>&#8592;</kbd><kbd>&#8593;</kbd><kbd>&#8594;</kbd><kbd>&#8595;</kbd></span>
  </div>
);

ControlsBar.propTypes = {
  useAI: React.PropTypes.bool.isRequired,
  snakeSize: React.PropTypes.number.isRequired,
  onReset: React.PropTypes.func,
  onToggleAI: React.PropTypes.func,
};

module.exports = ControlsBar;

