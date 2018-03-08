const chalk = require('chalk');
const SPEEDUP_VALUE = 100;
const MINIMUM_INTERVAL = 50;

class Part {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  getX() {
    return this._x;
  }
  getY() {
    return this._y;
  }
  setX(newVal) {
    this._x = newVal;
  }
  setY(newVal) {
    this._y = newVal;
  }
}

class Snake {
  constructor({ baseLength, x, y, symbol, screen }) {
    this._symbol = chalk.yellow(symbol);
    this._screen = screen;
    this.parts = [];
    for (let i = x; i > x - baseLength; i--) {
      this.parts.push(new Part(i, y));
    }
  }

  getLength() {
    return this.parts.length;
  }

  _grow() {
    const currentLength = this.getLength();
    const penult = this.parts[currentLength - 1];
    const last = this.parts[currentLength - 2];

    const penultX = penult.getX();
    const penultY = penult.getY();

    const lastX = last.getX();
    const lastY = last.getY();

    let newX, newY;

    if (penultX === lastX) {
      // direction: vertical
      newX = lastX;
      if (penultY > lastY) {
        newY = lastY - 1;
      } else {
        newY = lastY + 1;
      }
    } else {
      newY = lastY;
      // direction: horizontal
      if (penultX > lastX) {
        newX = lastX - 1;
      } else {
        newX = lastX + 1;
      }
    }

    this.parts.push(new Part(newX, newY));
  }

  isMoveAvailable(first, second) {
    return first.getX() !== second.getX() && first.getY() !== second.getY();
  }

  _checkGameOver(first) {
    const borderCollision = this._checkBorderCollision(first);
    const selfCollision = this._checkSelfCollision(first);

    return borderCollision || selfCollision;
  }

  _checkBorderCollision(first) {
    const x = first.getX();
    const y = first.getY();
    const collide = this._screen.getBorder().collide(x, y);

    return collide;
  }

  _checkSelfCollision(first) {
    const x = first.getX();
    const y = first.getY();
    return this.parts.some(
      (part, index) => index && (part.getX() === x && part.getY() === y)
    );
  }

  _speedup() {
    const movingInterval = this._screen.getMovingInterval();
    const selectedMove = this._screen.getSelectedMove();
    const newSpeedValue = (movingInterval - SPEEDUP_VALUE) <= MINIMUM_INTERVAL
      ? MINIMUM_INTERVAL
      : movingInterval - SPEEDUP_VALUE;

    this._screen.reinitializeMovingTimer(newSpeedValue, selectedMove);
  }

  move(xmod, ymod) {
    this._erase();
    if (!this._updatePositions(xmod, ymod)) {
      this.draw();
    } else {
      this._screen.restart();
    }
  }

  _isMovingAvailable(first, third) {
    return first.getX() !== third.getX() || first.getY() !== third.getY();
  }

  _updatePositions(xmod, ymod) {
    const lastIndex = this.getLength() - 1;
    const last = this.parts[lastIndex];
    const newPart = new Part(
      this.parts[0].getX() + xmod,
      this.parts[0].getY() + ymod
    );
    if (
      !this._isMovingAvailable(
        newPart,
        this.parts[1]
      )
    ) { return; }

    this.parts.splice(lastIndex, 1);
    this.parts.unshift(last);
    const newFirst = this.parts[0];
    const second = this.parts[1];

    newFirst.setX(second.getX() + xmod);
    newFirst.setY(second.getY() + ymod);

    // eating a rabbit
    if (this._screen.getRabbit().collide(newPart.getX(), newPart.getY())) {
      this._screen.placeRabbit();
      this._grow();
      this._speedup();
    }

    return this._checkGameOver(newPart);
  }

  draw() {
    this._output(this._symbol);
  }

  _erase() {
    this._output(' ');
  }

  _output(symbol) {
    let index = this.parts.length;

    while (this.parts[--index]) {
      const part = this.parts[index];

      process.stdout.cursorTo(part.getX(), part.getY());
      process.stdout.write(symbol);
    }
  }

  getParts() {
    return this.parts;
  }
}

module.exports = Snake;
