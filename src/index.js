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
  console.log(key);
  if (key === 38) { // UP
    grid.snake.setDirection(Direction.N);
  }
  else if (key === 39) { // RIGHT
    grid.snake.setDirection(Direction.E);
  }
  else if (key === 37) { // LEFT
    grid.snake.setDirection(Direction.W);
  }
  else if (key === 40) { // DOWN
    grid.snake.setDirection(Direction.S);
  }
});

