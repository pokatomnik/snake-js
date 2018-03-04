const Border = require('./Border');
const Snake = require('../Snake');
const Rabbit = require('../Rabbit');
const rnd = require('../../utils').randomInteger;

class Screen {
  constructor() {
    this.restart();
    this.enableControl();
  }

  enableControl() {
    process.stdin.on('keypress', (ch, key) => {
      if (!key) { return; }
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
          this.restart();
          break;
        default:
          break;
      }
    });
  }

  restart() {
    this.clear();
    this._border = new Border('█', this);
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

    this.placeRabbit();

    this._snake.draw();
    this._border.draw();
  }

  placeRabbit() {
    this._rabbit = new Rabbit({
      x: rnd(1, process.stdout.columns - this.getBorder().getIndent() - 1),
      y: rnd(1, process.stdout.rows - 1),
      symbol: '@',
      screen: this
    });
    this._rabbit.draw();
  }

  clear() {
    for (let i = 0; i < process.stdout.rows - 1; i++) {
      process.stdout.cursorTo(0, i);
      process.stdout.clearLine();
    }
  }

  getBorder() {
    return this._border;
  }

  getRabbit() {
    return this._rabbit;
  }

  sizesChanged() {
    const currentWidth = process.stdout.columns;
    const currentHeight = process.stdout.rows;

    return this.sizes.width !== currentWidth || this.sizes.height !== currentHeight;
  }
}

module.exports = Screen;
