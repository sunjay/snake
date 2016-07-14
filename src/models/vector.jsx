const {Record} = require('immutable');

const VectorRecord = Record({
  x: undefined,
  y: undefined,
});

class Vector extends VectorRecord {
  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  equals({x, y}) {
    return this.x === x && this.y === y;
  }

  add({x, y}) {
    return new Vector({
      x: this.x + x,
      y: this.y + y,
    });
  }

  sub({x, y}) {
    return new Vector({
      x: this.x - x,
      y: this.y - y,
    });
  }

  div(value) {
    return new Vector({
      x: this.x / value,
      y: this.y / value,
    });
  }

  dot({x, y}) {
    return this.x * x + this.y * y;
  }

  normalize() {
    return this.div(this.magnitude);
  }

  reverse() {
    return new Vector({
      x: -this.x,
      y: -this.y,
    });
  }

  squaredDistanceTo({x, y}) {
    return (this.x - x) ** 2 + (this.y - y) ** 2;
  }

  hash() {
    return this.x + "," + this.y;
  }
}

module.exports = Vector;

