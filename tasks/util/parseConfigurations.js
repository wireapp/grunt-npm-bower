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
const path = require('path');

const CONFIG_TYPE = require('./CONFIG_TYPE');

function parseConfiguration(path) {
  try {
    config = grunt.file.readJSON(path);
    return Promise.resolve(config);
  } catch (error) {
    return Promise.reject(error);
  }
}

function run(options) {
  grunt.log.writeln(`Parsing "${chalk.blue(options.bowerConfig)}" &  "${chalk.blue(options.npmConfig)}"...`);

  const bowerJSON = path.join(options.cwd, options.bowerConfig);
  const packageJSON = path.join(options.cwd, options.npmConfig);

  const configs = {};

  return parseConfiguration(bowerJSON)
    .catch(() => {
      grunt.log.writeln(chalk`Cannot find "{blue ${options.verbose
        ? bowerJSON
        : options.bowerConfig}}". Continuing with "{blue ${options.verbose
        ? packageJSON
        : options.npmConfig}}"...`);

      return {};
    })
    .then((bowerConfig) => {
      configs[CONFIG_TYPE.BOWER] = bowerConfig;
      return parseConfiguration(packageJSON)
    })
    .then((npmConfig) => {
      configs[CONFIG_TYPE.NPM] = npmConfig;
      return {
        message: 'Parsed configurations.',
        result: configs,
      };
    });
}

module.exports = {
  run,
};
