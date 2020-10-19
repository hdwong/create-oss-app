#!/usr/bin/env node

const yParser = require('yargs-parser');
const semver = require('semver');
const chalk = require('chalk');
const run = require('./run');
const args = yParser(process.argv.slice(2));

// 检查 node 版本
if (!semver.satisfies(process.version, '>= 8.0.0')) {
  console.error(chalk.red('✘ The generator will only work with Node v8.0.0 and up!'));
  process.exit(1);
}

const name = args._[0] || null,
    fileFormat = !!args['js'] ? 'js' : 'ts';

run({ name, fileFormat });
