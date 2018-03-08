const Border = require('./Border');
const Snake = require('../Snake');
const Rabbit = require('../Rabbit');
const rnd = require('../../utils').randomInteger;
const createControls = require('../controls');

const RABBIT_PLACING_BOUNDS = 5;

class Screen {
  constructor() {
    this.restart();
    this.enableControl();
  }

  enableControl() {
    this.controls = createControls(this);
    process.stdin.on('keypress', (ch, key) => {
      if (!key) { return; }
      this.controls.emit(key.name);
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
    let inSnake, x, y;

    do {
      x = rnd(
        1 + RABBIT_PLACING_BOUNDS,
        process.stdout.columns - this.getBorder().getIndent() - RABBIT_PLACING_BOUNDS
      );
      y = rnd(
        1 + RABBIT_PLACING_BOUNDS,
        process.stdout.rows - 1 - RABBIT_PLACING_BOUNDS
      );
      
      inSnake = this._snake
        .getParts()
        .some(
          part => part.getX() === x && part.getY() === y
        );
    } while (inSnake);

    this._rabbit = new Rabbit({
      x,
      y,
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

  getSnake() {
    return this._snake;
  }

  sizesChanged() {
    const currentWidth = process.stdout.columns;
    const currentHeight = process.stdout.rows;

    return this.sizes.width !== currentWidth || this.sizes.height !== currentHeight;
  }
}

module.exports = Screen;
