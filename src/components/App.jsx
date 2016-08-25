const React = require('react');

const Snake = require('../containers/Snake');
const Controls = require('../containers/Controls');

const {app, footer} = require('../../scss/index.scss');

const App = () => (
  <div className={app}>
    <Snake />
    <Controls />
    <footer className={footer}>
      By Sunjay Varma &middot; <a target='_blank' href='https://github.com/sunjay/snake'>Fork me on GitHub</a>
    </footer>
  </div>
);

module.exports = App;

