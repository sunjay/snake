/**
 * Abstraction of 2D Canvas API to allow for the possibility of
 * extending this to other drawing APIs
 * Also makes it possible to optimize drawing later on easily
 */
class Canvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawRect({x, y, width, height, ...styles}) {
    this._withStyles(styles, (ctx) => {
      if (styles.fillStyle) {
        ctx.fillRect(x, y, width, height);
      }
      if (styles.strokeStyle) {
        ctx.strokeRect(x, y, width, height);
      }
    });
  }

  drawLine({x1, y1, x2, y2, ...styles}) {
    this._withStyles(styles, (ctx) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  }

  drawText({text, x, y, maxWidth = undefined, fontSize = null, ...styles}) {
    this._withStyles({
      textAlign: 'center',
      textBaseline: 'middle',
      fillStyle: 'black',
      strokeStyle: 'white',
      lineWidth: 2,
      ...(fontSize ? {
        font: fontSize ? `${fontSize}px sans-serif` : undefined,
      } : {}),
      ...styles,
    }, (ctx) => {
      ctx.strokeText(text, x, y, maxWidth);
      ctx.fillText(text, x, y, maxWidth);
    });
  }

  _withStyles(styles, modifier) {
    const savedStyles = Object.keys(styles).reduce((saved, style) => ({
      ...saved,
      [style]: this.ctx[style],
    }), {});

    Object.assign(this.ctx, styles);
    modifier(this.ctx);

    Object.assign(this.ctx, savedStyles);
  }
}

module.exports = Canvas;
