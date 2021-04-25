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
    this._controls = createControls(this);
    process.stdin.on('keypress', (ch, key) => {
      // if invalid key
      if (!key || !this._controls.getAvailableEvents().includes(key.name)) { return; }

      // forbid to move backward
      if (this._controls.getOppositeMap()[key.name] === this.getSelectedMove()) { return; }

      // snake haven't move moving is not allowed
      if (!this._directionChangeAllowed) { return; }

      // moving directions are the same
      if (key.name === this._selectedMove) { return; }

      this._directionChangeAllowed = false;

      this._selectedMove = key.name;
    });
  }

  restart() {
    this.clear();
    this._border = new Border('⚅', this);
    this._sizes = {
      width: process.stdout.columns,
      height: process.stdout.rows
    };

    this._snake = new Snake({
      baseLength: 5,
      x: 20,
      y: 20,
      symbol: '◉',
      screen: this
    });

    this.placeRabbit();

    this._snake.draw();
    this._border.draw();

    this._directionChangeAllowed = true;

    this.reinitializeMovingTimer();
  }

  reinitializeMovingTimer(interval = 300, selectedMove = 'right') {
    this._movingInterval = interval;
    clearInterval(this._movingTimer);
    this._selectedMove = selectedMove;
    this._movingTimer = setInterval(() => {
      this._controls.emit(this._selectedMove);
      this._directionChangeAllowed = true;
    }, this._movingInterval);
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
      symbol: '🐰',
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

  getMovingInterval() {
    return this._movingInterval;
  }

  getSelectedMove() {
    return this._selectedMove;
  }

  sizesChanged() {
    const currentWidth = process.stdout.columns;
    const currentHeight = process.stdout.rows;

    return this._sizes.width !== currentWidth || this._sizes.height !== currentHeight;
  }
}

module.exports = Screen;
