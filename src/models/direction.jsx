const Vector = require('./vector');

export const N = new Vector({x: 0, y: -1});
export const S = new Vector({x: 0, y: 1});
export const E = new Vector({x: 1, y: 0});
export const W = new Vector({x: -1, y: 0});

export function isOpposite(d1, d2) {
  return d1.dot(d2) < 0;
}

