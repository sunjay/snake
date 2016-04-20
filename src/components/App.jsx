const React = require('react');

const Snake = require('../containers/Snake');
const Controls = require('../containers/Controls');

const {app} = require('../../scss/index.scss');

const App = () => (
  <div className={app}>
    <Snake />
    <Controls />
  </div>
);

module.exports = App;

