const Direction = require('./direction');

class Snake {
  constructor(body = []) {
    this.body = body;
    this.direction = Direction.E;
  }
}

module.exports = Snake;

