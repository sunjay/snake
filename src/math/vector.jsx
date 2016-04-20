class Vector {
  constructor({x, y}) {
    this.x = x;
    this.y = y;
  }

  get length() {
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
    return this.div(this.length);
  }
}

module.exports = Vector;

