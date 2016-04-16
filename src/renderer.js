const Game = require('./game');
const Grid = require('./grid');
const Canvas = require('./canvas');

/**
 * Renders the given grid in the parent
 */
class Renderer {
  static SNAKE_COLOR = '#8AFFA5';
  static GRID_COLOR = '#DDD';
  static GOAL_COLOR = '#8AC2FF';
  static BORDER_COLOR = '#444';

  constructor({parent, game, width, height}) {
    this.parent = parent;
    this.game = game;

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

    const {state, message, grid} = this.game.render();

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.renderGrid({grid, width, height});

    this.renderState({state, message, width, height});
  }

  renderState({state, message, width, height}) {
    if (Game.isReady(state)) {
      this.renderTitle({
        title: 'Snake',
        subtitle: (
          'Collect the food and grow your tail\n' +
          'Press any of the arrow keys to begin'
        ),
        titleFillStyle: '#00C210',
        width, height,
      });
    }
    else if (Game.isLost(state)) {
      this.renderTitle({
        title: 'You Lost',
        subtitle: message + '\nPress r',
        titleFillStyle: '#FF5454',
        width, height,
      });
    }
    else if (Game.isWon(state)) {
      this.renderTitle({
        title: 'You Won!',
        subtitle: 'Press r',
        titleFillStyle: '#AAFF54',
        width, height,
      });
    }
  }
  
  renderTitle({title, subtitle, titleFillStyle, width, height}) {
    const titleSize = 70;
    const subtitleSize = 20;
    const lineSpacing = 10;

    const titleLines = title.split('\n');
    const subtitleLines = subtitle.split('\n');

    for (let i = 0; i < titleLines.length; i++) {
      let titleLine = titleLines[i];
      this.canvas.drawText({
        text: titleLine,
        x: width / 2,
        y: height / 2 - (titleLines.length - i - 1) * (titleSize + lineSpacing) - titleSize / 2 - lineSpacing,
        fontSize: titleSize,
        fillStyle: titleFillStyle,
      });
    }

    for (let i = 0; i < subtitleLines.length; i++) {
      let subtitleLine = subtitleLines[i];
      this.canvas.drawText({
        text: subtitleLine,
        x: width / 2,
        y: height / 2 + i * (subtitleSize + lineSpacing),
        fontSize: subtitleSize,
      });
    }
  }

  renderGrid({grid: {rows, cols, tiles}, width, height}) {
    const tileWidth = width / cols;
    const tileHeight = height / rows;

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

    this.renderGridBackground({rows, cols, width, height, tileWidth, tileHeight});
    this.renderBorder({width, height});
  }

  renderGridBackground({rows, cols, width, height, tileWidth, tileHeight}) {
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

  renderBorder({width, height}) {
    const styles = {lineWidth: 1, strokeStyle: Renderer.BORDER_COLOR};
    this.canvas.drawLine({
      x1: 0,
      y1: 0,
      x2: width,
      y2: 0,
      ...styles,
    });
    this.canvas.drawLine({
      x1: 0,
      y1: height,
      x2: width,
      y2: height,
      ...styles,
    });
    this.canvas.drawLine({
      x1: 0,
      y1: 0,
      x2: 0,
      y2: height,
      ...styles,
    });
    this.canvas.drawLine({
      x1: width,
      y1: 0,
      x2: width,
      y2: height,
      ...styles,
    });
  }
}

module.exports = Renderer;

