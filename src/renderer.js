const Grid = require('./grid');
const Canvas = require('./canvas');

/**
 * Renders the given grid in the parent
 */
class Renderer {
  static SNAKE_COLOR = '#8AFFA5';
  static GRID_COLOR = '#888';
  static GOAL_COLOR = '#8AC2FF';

  constructor({parent, grid, width, height}) {
    this.parent = parent;
    this.grid = grid;

    const canvasElement = this._createCanvas({width, height});
    this.canvas = new Canvas(canvasElement);
  }

  _createCanvas({width, height}) {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    this.parent.appendChild(canvasElement);

    return canvasElement;
  }

  render() {
    this.canvas.clear();

    const tiles = this.grid.render();

    const width = this.canvas.width;
    const height = this.canvas.height;

    const rows = this.grid.rows;
    const cols = this.grid.cols;

    const tileWidth = width / cols;
    const tileHeight = height / rows;

    this.renderGrid({rows, cols, width, height, tileWidth, tileHeight});

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = tiles[row][col];

        const rect = {
          x: col * tileWidth,
          y: row * tileHeight,
          width: tileWidth,
          height: tileHeight,
          lineWidth: 0,
        };

        if (Grid.isSnakeTile(tile)) {
          this.canvas.drawRect({
            ...rect,
            fillStyle: Renderer.SNAKE_COLOR,
          });
        }
        else if (Grid.isGoalTile(tile)) {
          this.canvas.drawRect({
            ...rect,
            fillStyle: Renderer.GOAL_COLOR,
          });
        }
      }
    }
  }

  renderGrid({rows, cols, width, height, tileWidth, tileHeight}) {
    this.renderVerticalGrid({rows, width, tileHeight});
    this.renderHorizontalGrid({cols, height, tileWidth});
  }

  renderHorizontalGrid({cols, height, tileWidth}) {
    for (let col = 0; col <= cols; col++) {
      this.canvas.drawLine({ 
        x1: col * tileWidth,
        y1: 0,
        x2: col * tileWidth,
        y2: height,
        lineWidth: 1,
        strokeStyle: Renderer.GRID_COLOR,
      });
    }
  }

  renderVerticalGrid({rows, width, tileHeight}) {
    for (let row = 0; row <= rows; row++) {
      this.canvas.drawLine({ 
        x1: 0,
        y1: row * tileHeight,
        x2: width,
        y2: row * tileHeight,
        lineWidth: 1,
        strokeStyle: Renderer.GRID_COLOR,
      });
    }
  }
}

module.exports = Renderer;

