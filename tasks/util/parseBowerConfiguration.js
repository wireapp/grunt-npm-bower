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

function run(options) {
  grunt.log.writeln(`Validating "${chalk.blue(options.bowerConfig)}"...`);

  const bowerConfigPath = path.join(options.cwd, options.bowerConfig);
  let bowerConfig;

  try {
    bowerConfig = grunt.file.readJSON(bowerConfigPath);
  } catch (error) {
    return Promise.resolve({
      message: chalk`Cannot find "{blue ${options.bowerConfig}}". Continuing with "{blue package.json}"...`,
      result: {
        type: CONFIG_TYPE.NPM,
        settings: grunt.file.readJSON(path.join(options.cwd, 'package.json')),
      },
    });
  }

  const logger = options.verbose ? grunt.log : grunt.verbose;

  return Promise.resolve().then(() => {
    if (bowerConfig[options.overrideProp]) {
      const message = chalk`Found property "{yellowBright ${options.overrideProp}}" in "{blue ${options.verbose
        ? bowerConfigPath
        : options.bowerConfig}}".`;
      logger.writeln(message);
    }

    return {
      message: chalk`Found valid Bower configuration in "{blue ${options.verbose
        ? bowerConfigPath
        : options.bowerConfig}}".`,
      result: {
        type: CONFIG_TYPE.BOWER,
        settings: bowerConfig,
      },
    };
  });
}

module.exports = {
  run,
};
