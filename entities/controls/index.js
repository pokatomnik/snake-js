const EventEmitter = require('events');

class Controls extends EventEmitter {
  constructor(game) {
    super();
    this._game = game;
    this._oppositeMap = {
      left: 'right',
      right: 'left',
      up: 'down',
      down: 'up'
    };
  }

  getOppositeMap() {
    return this._oppositeMap;
  }

  getAvailableEvents() {
    return Object.keys(this._events);
  }
}

module.exports = (game) => {
  const controls = new Controls(game);

  controls.on('right', function () {
    this._game.getSnake().move(1, 0);
  });

  controls.on('up', function () {
    this._game.getSnake().move(0, -1);
  });

  controls.on('left', function () {
    this._game.getSnake().move(-1, 0);
  });

  controls.on('down', function () {
    this._game.getSnake().move(0, 1);
  });

  controls.on('q', function () {
    process.exit(0);
  });

  controls.on('r', function () {
    this._game.restart();
  });

  return controls;
};