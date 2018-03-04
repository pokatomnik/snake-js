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
    this._symbol = symbol;
    this._screen = screen;
    this.parts = [];
    for (let i = x; i > x - baseLength; i--) {
      this.parts.push(new Part(i, y));
    }
  }

  getLength() {
    return this.parts.length;
  }

  grow() {
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

  checkGameOver(first) {
    const x = first.getX();
    const y = first.getY();
    return this._screen.getBorder().collide(x, y);
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
    this._screen.getBorder().putString(`x = ${xmod}; y = ${ymod}`);
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

    return this.checkGameOver(newPart);
  }

  draw() {
    this._output(this._symbol);
  }

  _erase() {
    this._output(' ');
  }

  _output(symbol) {
    for (let part of this.parts) {
      process.stdout.cursorTo(part.getX(), part.getY());
      process.stdout.write(symbol);
    }
  }
}

module.exports = Snake;
