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

const path = require('path');

const parseConfigurations = require('../../tasks/util/parseConfigurations');
const CONFIG_TYPE = require('../../tasks/util/CONFIG_TYPE');

describe('parseConfigurations', () => {
  describe('"run"', () => {
    it('loads a specified Bower configuration file.', done => {
      const options = {
        cwd: process.cwd(),
      };
      options.bowerConfig = path.relative(options.cwd, `${__dirname}/../fixtures/bower.json`);
      options.npmConfig = path.relative(options.cwd, `${__dirname}/../fixtures/package.json`);

      parseConfigurations
        .run(options)
        .then(({result}) => {
          const bowerConfig = result[CONFIG_TYPE.BOWER];
          expect(bowerConfig.exportsOverride).toBeDefined();
          done();
        })
        .catch(done.fail);
    });
  });
});
