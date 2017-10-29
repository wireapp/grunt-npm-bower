/*
 * Wire
 * Copyright (C) 2017 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

const chalk = require('chalk');
const grunt = require('grunt');

const DEFAULT_OPTIONS = {
  bowerConfig: 'bower.json',
  cleanTargetDir: false,
  componentDir: 'node_modules',
  overrideProp: 'exportsOverride',
  resolveName: true,
  verbose: false,
};

const REQUIRED_OPTIONS = ['targetDir'];

function verifyOptions(options, requiredOptions) {
  requiredOptions.forEach(option => {
    if (!options[option]) {
      throw new Error(`Missing option "${option}".`);
    }
  });
}

function run(customOptions) {
  grunt.log.writeln(`Parsing task options...`);

  const options = customOptions(DEFAULT_OPTIONS);
  options.cwd = grunt.option('base') || process.cwd();

  return Promise.resolve()
    .then(() => verifyOptions(options, REQUIRED_OPTIONS))
    .then(() => ({
      message: chalk`Options: {blue ${JSON.stringify(options)}}`,
      result: options,
    }));
}

module.exports = {
  DEFAULT_OPTIONS,
  REQUIRED_OPTIONS,
  run,
};
