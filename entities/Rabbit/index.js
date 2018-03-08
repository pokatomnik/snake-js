const chalk = require('chalk');

class Rabbit {
  constructor({x, y, symbol = '@', screen}) {
    this._x = x;
    this._y = y;
    this._symbol = chalk.green(symbol);
    this._screen = screen;
  }

  draw() {
    process.stdout.cursorTo(this._x, this._y);
    process.stdout.write(this._symbol);
  }

  consumed() {
    this._screen.placeRabbit();
  }

  collide(x, y) {
    return x === this._x && y === this._y;
  }
}

module.exports = Rabbit;