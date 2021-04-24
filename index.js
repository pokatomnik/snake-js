#!/usr/bin/env node

const Screen = require('./entities/Screen');
const readline = require('readline');

// enable keypress events
readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  // enable raw input: no return required
  process.stdin.setRawMode(true);
}

// hide caret
process.stderr.write('\x1B[?25l');

// show caret after close
process.on('exit', () => {
  process.stderr.write('\x1B[?25h');
});

// start the game
new Screen();
