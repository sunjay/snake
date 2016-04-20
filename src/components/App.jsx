const React = require('react');

const Controls = require('../containers/Controls');

const {app} = require('../../scss/index.scss');

const App = () => (
  <div className={app}>
    <h1>Hello World!</h1>
    <Controls />
  </div>
);

module.exports = App;

