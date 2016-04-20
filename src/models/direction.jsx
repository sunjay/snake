const Vector = require('./vector');

class Direction {
  static N = new Vector({x: 0, y: -1});
  static S = new Vector({x: 0, y: 1});
  static E = new Vector({x: 1, y: 0});
  static W = new Vector({x: -1, y: 0});

  static isOpposite(d1, d2) {
    return d1.dot(d2) < 0;
  }

  constructor() {
    throw new Error('Static class');
  }
}

module.exports = Direction;

