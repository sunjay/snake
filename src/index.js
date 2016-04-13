const Direction = require('./direction');
const Grid = require('./grid');
const Renderer = require('./renderer');

const container = document.getElementById('game-container');
const grid = new Grid({rows: 30, cols: 30});

const renderer = new Renderer({
  parent: container,
  grid: grid,
  width: 600, // px
  height: 600, // px
});

function loop() {
  grid.update();
  renderer.render();

  window.requestAnimationFrame(loop);
}
loop();

document.addEventListener('keydown', () => {
  const key = event.width || event.keyCode;
  let direction = null;
  if (key === 38) { // UP
    direction = Direction.N;
  }
  else if (key === 39) { // RIGHT
    direction = Direction.E;
  }
  else if (key === 37) { // LEFT
    direction = Direction.W;
  }
  else if (key === 40) { // DOWN
    direction = Direction.S;
  }

  if (direction && grid.snake.canTravelInDirection(direction)) {
    grid.snake.setDirection(direction);
  }
});

