#!/usr/bin/env node

const Screen = require('./entities/Screen');
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

new Screen();