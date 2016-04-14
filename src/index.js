const Direction = require('./direction');
const Grid = require('./grid');
const Renderer = require('./renderer');

const container = document.getElementById('game-container');
const snakeLength = document.getElementById('snake-length');

let grid, renderer;
reset();
loop();

function reset() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  grid = new Grid({rows: 30, cols: 30});

  renderer = new Renderer({
    parent: container,
    grid: grid,
    width: 600, // px
    height: 600, // px
  });
}

function loop() {
  window.requestAnimationFrame(loop);

  grid.update();
  renderer.render();

  snakeLength.textContent = `Length: ${grid.snake.size}`;
}

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

document.getElementById('reset').addEventListener('click', () => {
  reset();
});

