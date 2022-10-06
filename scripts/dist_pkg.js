#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');


var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .example('$0 -o build', 'create a package.json for npmjs')
  .alias('o', 'outputDir')
  .nargs('o', 1)
  .describe('o', 'Output directory')
  .demandOption(['o'])
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2020')
  .argv;

// create package.json file
let fileName = 'package.json';
let importFiles = [
  'runtime',
  'polyfills',
  'main',
  'runtime-es5',
  'polyfills-es5',
  'main-es5'
];
let rawdata = fs.readFileSync(fileName);
let data = JSON.parse(rawdata);
delete (data.private);
delete (data.devDependencies);
delete (data.dependencies);
delete (data.scripts);
fs.writeFileSync(path.join(argv.o, fileName), JSON.stringify(data, null, 2));
