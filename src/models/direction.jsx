const Vector = require('./vector');

export const NORTH = 'N';
export const SOUTH = 'S';
export const EAST = 'E';
export const WEST = 'W';

const ALL = {
  [NORTH]: new Vector({x: 0, y: -1}),
  [SOUTH]: new Vector({x: 0, y: 1}),
  [EAST]: new Vector({x: 1, y: 0}),
  [WEST]: new Vector({x: -1, y: 0}),
};

export function all() {
  return names().map((n) => ALL[n]);
}

export function names() {
  return Object.keys(ALL);
}

export function isOpposite(d1, d2) {
  return d1.dot(d2) < 0;
}

export function toName(direction) {
  return names().find((name) => ALL[name].equals(direction));
}

export function toDirection(name) {
  return ALL[name];
}

