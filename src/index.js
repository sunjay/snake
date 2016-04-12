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
  renderer.render();

  window.requestAnimationFrame(loop);
}
loop();

