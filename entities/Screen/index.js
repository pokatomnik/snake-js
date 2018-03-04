const _ = require('lodash');
const Border = require('./Border');
const Snake = require('../Snake');

class Screen {
  constructor(params) {
    this.restart(params);
  }

  restart({ tickPeriod }) {
    this.clear();
    this._tickPeriod = tickPeriod;
    this._border = new Border('█', this);
    this._tickTimerId = undefined;
    this.sizes = {
      width: process.stdout.columns,
      height: process.stdout.rows
    };

    this._snake = new Snake({
      baseLength: 5,
      x: 20,
      y: 20,
      symbol: '*',
      screen: this
    });

    this._baseCreate();
  }

  clear() {
    for (let i = 0; i < process.stdout.rows - 1; i++) {
      process.stdout.cursorTo(0, i);
      process.stdout.clearLine();
    }
  }

  start() {
    this._baseRepaint();
    this.clear();
    this._tickTimerId = setInterval(() => {
      this._baseRepaint();
    }, this._tickPeriod);

    process.stdin.on('keypress', (ch, key) => {
      switch (key.name) {
        case 'right':
          this._snake.move(1, 0);
          break;
        case 'up':
          this._snake.move(0, -1);
          break;
        case 'left':
          this._snake.move(-1, 0);
          break;
        case 'down':
          this._snake.move(0, 1);
          break;
        case 'q':
          process.exit(0);
          break;
        case 'r':
          this.restart({
            tickPeriod: this._tickPeriod
          });
          break;
        default:
          break;
      }
    });
  }

  stop() {
    clearInterval(this._tickTimerId);
    this._tickTimerId = undefined;
    process.stdin.off('keypress');
  }

  isStarted() {
    return !!this._tickTimerId;
  }


  _baseCreate() {
    this._snake.draw();
    this._baseRepaint();
  }

  _baseRepaint() {
    const currentWidth = process.stdout.columns;
    const currentHeight = process.stdout.rows;

    this._border.draw();

    if (this.sizes.width !== currentWidth || this.sizes.height !== currentHeight) {
      this.restart({
        tickPeriod: this._tickPeriod
      });
    }
  }

  getTickPeriod() {
    return this._tickPeriod;
  }
}

module.exports = Screen;
