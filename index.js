#!/usr/bin/env node

const Screen = require('./entities/Screen');
const readline = require('readline');

/* Some terminal magic */
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();
// hide caret
process.stderr.write('\x1B[?25l');

process.on('exit', () => {
  process.stderr.write('\x1B[?25h');
});

new Screen();
