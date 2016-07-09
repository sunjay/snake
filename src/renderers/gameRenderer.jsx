const Direction = require('../models/direction');

const SNAKE_COLOR = '#8AFFA5';
const GRID_COLOR = '#DDD';
const GOAL_COLOR = '#8AC2FF';
const BORDER_COLOR = '#444';
const PATH_COLOR = '#FFD000';
const DEAD_END_COLOR = '#FF0000';

export function renderGame(canvas, {game}) {
  const status = game.status;
  const width = canvas.width;
  const height = canvas.height;

  renderGrid(canvas, {game, width, height});
  renderStatus(canvas, {status, width, height});
}

export function renderAI(canvas, {game, useAI, debugAIPath, pathPlan}) {
  if (!useAI || !debugAIPath) {
    return;
  }

  const snake = game.snake;
  const goal = game.goal;
  const head = snake.head();
  const direction = snake.direction;
  // direction is null at the start of the game
  if (!direction) {
    return;
  }
  const tileWidth = canvas.width / game.cols;
  const tileHeight = canvas.height / game.rows;

  if (pathPlan.hasPlan()) {
    renderPlannedPath(canvas, {head, goal, direction, pathPlan, tileWidth, tileHeight});
  }
  else {
    renderDeadEnd(canvas, {head, direction, tileWidth, tileHeight});
  }
}

function renderPlannedPath(canvas, {head, goal, direction, pathPlan, tileWidth, tileHeight}) {
  let current = head;

  while (true) {
    const next = pathPlan.firstTurn();
    if (!next) {
      break;
    }

    canvas.drawLine({ 
      x1: current.x * tileWidth + tileWidth / 2,
      y1: current.y * tileHeight + tileHeight / 2,
      x2: next.x * tileWidth + tileWidth / 2,
      y2: next.y * tileHeight + tileHeight / 2,
      lineWidth: 2,
      strokeStyle: PATH_COLOR,
    });

    current = next;
    pathPlan = pathPlan.shift();
  }

  canvas.drawLine({ 
    x1: current.x * tileWidth + tileWidth / 2,
    y1: current.y * tileHeight + tileHeight / 2,
    x2: goal.x * tileWidth + tileWidth / 2,
    y2: goal.y * tileHeight + tileHeight / 2,
    lineWidth: 2,
    strokeStyle: PATH_COLOR,
  });
}

function renderDeadEnd(canvas, {head, direction, tileWidth, tileHeight}) {
  const next = head.add(direction);

  canvas.drawLine({ 
    x1: head.x * tileWidth + tileWidth / 2,
    y1: head.y * tileHeight + tileHeight / 2,
    x2: next.x * tileWidth + tileWidth / 2,
    y2: next.y * tileHeight + tileHeight / 2,
    lineWidth: 2,
    strokeStyle: DEAD_END_COLOR,
  });

  // Draw an x through the next square
  canvas.drawLine({ 
    x1: next.x * tileWidth + tileWidth / 2 - tileWidth / 3,
    y1: next.y * tileHeight + tileHeight / 2 - tileHeight / 3,
    x2: next.x * tileWidth + tileWidth / 2 + tileWidth / 3,
    y2: next.y * tileHeight + tileHeight / 2 + tileHeight / 3,
    lineWidth: 2,
    strokeStyle: DEAD_END_COLOR,
  });
  canvas.drawLine({ 
    x1: next.x * tileWidth + tileWidth / 2 + tileWidth / 3,
    y1: next.y * tileHeight + tileHeight / 2 - tileHeight / 3,
    x2: next.x * tileWidth + tileWidth / 2 - tileWidth / 3,
    y2: next.y * tileHeight + tileHeight / 2 + tileHeight / 3,
    lineWidth: 2,
    strokeStyle: DEAD_END_COLOR,
  });
}

function renderStatus(canvas, {status, width, height}) {
  if (status.isReady) {
    renderTitle(canvas, {
      title: 'Snake',
      subtitle: (
        'Collect the food and grow your tail\n' +
        'Press any of the arrow keys to begin'
      ),
      titleFillStyle: '#00C210',
      width, height,
    });
  }
  else if (status.isLost) {
    renderTitle(canvas, {
      title: 'You Lost',
      subtitle: status.message + '\nPress r',
      titleFillStyle: '#FF5454',
      width, height,
    });
  }
  else if (status.isWon) {
    renderTitle(canvas, {
      title: 'You Won!',
      subtitle: 'Press r',
      titleFillStyle: '#AAFF54',
      width, height,
    });
  }
}

function renderTitle(canvas, {title, subtitle, titleFillStyle, width, height}) {
  const titleSize = 70;
  const subtitleSize = 20;
  const lineSpacing = 10;

  const titleLines = title.split('\n');
  const subtitleLines = subtitle.split('\n');

  for (let i = 0; i < titleLines.length; i++) {
    let titleLine = titleLines[i];
    canvas.drawText({
      text: titleLine,
      x: width / 2,
      y: height / 2 - (titleLines.length - i - 1) * (titleSize + lineSpacing) - titleSize / 2 - lineSpacing,
      fontSize: titleSize,
      fillStyle: titleFillStyle,
    });
  }

  for (let i = 0; i < subtitleLines.length; i++) {
    let subtitleLine = subtitleLines[i];
    canvas.drawText({
      text: subtitleLine,
      x: width / 2,
      y: height / 2 + i * (subtitleSize + lineSpacing),
      fontSize: subtitleSize,
    });
  }
}

function renderGrid(canvas, {game, width, height}) {
  const {rows, cols, snake, goal} = game;
  const tileWidth = width / cols;
  const tileHeight = height / rows;

  const rect = {
    width: tileWidth,
    height: tileHeight,
    lineWidth: 0,
  };

  for (let {x, y} of snake.body) {
    canvas.drawRect({
      ...rect,
      x: x * tileWidth,
      y: y * tileHeight,
      fillStyle: SNAKE_COLOR,
    });
  }

  if (goal) {
    const {x, y} = goal;
    canvas.drawRect({
      ...rect,
      x: x * tileWidth,
      y: y * tileHeight,
      fillStyle: GOAL_COLOR,
    });
  }

  renderGridBackground(canvas, {rows, cols, width, height, tileWidth, tileHeight});
  renderBorder(canvas, {width, height});
}

function renderGridBackground(canvas, {rows, cols, width, height, tileWidth, tileHeight}) {
  renderVerticalGrid(canvas, {rows, width, tileHeight});
  renderHorizontalGrid(canvas, {cols, height, tileWidth});
}

function renderHorizontalGrid(canvas, {cols, height, tileWidth}) {
  for (let col = 0; col <= cols; col++) {
    canvas.drawLine({ 
      x1: col * tileWidth,
      y1: 0,
      x2: col * tileWidth,
      y2: height,
      lineWidth: 1,
      strokeStyle: GRID_COLOR,
    });
  }
}

function renderVerticalGrid(canvas, {rows, width, tileHeight}) {
  for (let row = 0; row <= rows; row++) {
    canvas.drawLine({ 
      x1: 0,
      y1: row * tileHeight,
      x2: width,
      y2: row * tileHeight,
      lineWidth: 1,
      strokeStyle: GRID_COLOR,
    });
  }
}

function renderBorder(canvas, {width, height}) {
  const styles = {lineWidth: 1, strokeStyle: BORDER_COLOR};
  canvas.drawLine({
    x1: 0,
    y1: 0,
    x2: width,
    y2: 0,
    ...styles,
  });
  canvas.drawLine({
    x1: 0,
    y1: height,
    x2: width,
    y2: height,
    ...styles,
  });
  canvas.drawLine({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: height,
    ...styles,
  });
  canvas.drawLine({
    x1: width,
    y1: 0,
    x2: width,
    y2: height,
    ...styles,
  });
}

