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
const fs = require('fs-extra');
const grunt = require('grunt');
const path = require('path');

function run(options) {
  grunt.log.writeln(`Removing directory "${chalk.blue(options.targetDir)}"...`);
  const targetDir = path.join(options.cwd, options.targetDir);

  return fs.remove(targetDir).then(() => {
    return {
      message: chalk`Removed directory "{blue ${options.verbose ? targetDir : options.targetDir}}".`,
      result: path.normalize(targetDir),
    };
  });
}

module.exports = {
  run,
};
