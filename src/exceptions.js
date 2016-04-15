// Extending error wasn't working and instanceof checks were always failing
// This is a completely custom class, which has its drawbacks, but works
class SnakeError {
  constructor(message) {
    this.message = message; 
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}    

export class GameLost extends SnakeError {
}

