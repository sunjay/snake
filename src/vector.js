class Vector {
  constructor({x, y}) {
    this.x = x;
    this.y = y;
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

  dot({x, y}) {
    return this.x * x + this.y * y;
  }
}

module.exports = Vector;

