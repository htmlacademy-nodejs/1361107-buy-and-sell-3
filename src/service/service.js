"use strict";

const {cli} = require(`./cli`);
const {USER_ARGV_INDEX, ExitCode, DEFAULT_COMMAND} = require(`../constants`);

const userArgs = process.argv.slice(USER_ARGV_INDEX);

const [commandName] = userArgs;

if (userArgs.length === 0 || !cli[commandName]) {
  cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode);
}

cli[commandName].run(userArgs.slice(1));
