class Border {
  constructor(borderSymbol, screen, indent = 1) {
    this._screen = screen;
    this._borderSymbol = borderSymbol;
    this._indent = indent;
  }

  draw() {
    this
      ._drawTop()
      ._drawBottom()
      ._drawLeft()
      ._drawRight();
  }

  _drawTop() {
    process.stdout.cursorTo(0, 0);
    this._drawRow();

    return this;
  }

  _drawBottom() {
    process.stdout.cursorTo(0, process.stdout.rows - 1);
    this._drawRow();

    return this;
  }

  _drawLeft() {
    this._drawColumn(0);
    return this;
  }

  _drawRight() {
    this._drawColumn(process.stdout.columns - this._indent - 1);
    return this;
  }

  _drawRow() {
    for (let i = 0; i < process.stdout.columns - this._indent; i++) {
      process.stdout.write(this._borderSymbol);
    }
  }
  
  _drawColumn(x) {
    for (let i = 0; i < process.stdout.rows; i++) {
      process.stdout.cursorTo(x, i);
      process.stdout.write(this._borderSymbol);
    }
  }

  putString(string, pos = 5) {
    this._drawTop();
    process.stdout.cursorTo(pos, 0);
    process.stdout.write(`|${string}|`);
  }

  collide(x, y) {
    return x === 0 ||
           y === 0 ||
           x === process.stdout.columns - this._indent - 1 ||
           y === process.stdout.rows - 1;

  }

  getIndent() {
    return this._indent;
  }
}

module.exports = Border;