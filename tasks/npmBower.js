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

const pkg = require('../package.json');

const cleanTargetDir = require('./util/cleanTargetDir');
const copyBowerComponents = require('./util/copyBowerComponents');
const getOptions = require('./util/getOptions');
const parseConfigurations = require('./util/parseConfigurations');

const PLUGIN_NAME = 'npmBower';
const PLUGIN_DESCRIPTION = pkg.description;

module.exports = grunt => {
  grunt.registerTask(PLUGIN_NAME, PLUGIN_DESCRIPTION, function() {
    const done = this.async();
    let options;

    return getOptions
      .run(this.options)
      .then(({message, result}) => {
        options = result;
        grunt.log.ok(message);
        if (options.cleanTargetDir) {
          return cleanTargetDir.run(options).then(({message}) => grunt.log.ok(message));
        }
      })
      .then(() => parseConfigurations.run(options))
      .then(({message, result: bowerConfig}) => {
        grunt.log.ok(message);
        return copyBowerComponents.run(options, bowerConfig);
      })
      .then(({message}) => {
        grunt.log.ok(message);
        done();
      })
      .catch(error => {
        grunt.log.error(`Plugin failed: ${error.message}`);
        done(false);
      });
  });
};
