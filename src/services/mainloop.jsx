const {updateGame} = require('../actions/actions');

class FrameRate {
  constructor(fps) {
    this.fps = fps;
    this.lastUpdate = null;
  }

  get fps() {
    return this._fps;
  }

  set fps(value) {
    this._fps = value;
    this.msPerFrame = 1000 / value;
  }

  shouldUpdate() {
    const delta = Date.now() - this.lastUpdate;
    if (!this.lastUpdate || delta >= this.msPerFrame) {
      this.lastUpdate = Date.now();
      return true;
    }
    return false;
  }
}

export const start = ({dispatch}) => {
  const framerate = new FrameRate(15);

  function loop() {
    window.requestAnimationFrame(loop);

    if (!framerate.shouldUpdate()) {
      return;
    }

    dispatch(updateGame());
  }
  loop();
};

