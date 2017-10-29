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

const fs = require('fs-extra');
const path = require('path');

const cleanTargetDir = require('../../tasks/util/cleanTargetDir');

describe('cleanTargetDir', () => {
  let storagePath = undefined;

  beforeEach(done => {
    fs.mkdtemp(path.join(__dirname, 'test-'), (error, folder) => {
      if (error) {
        done.fail(error);
      } else {
        storagePath = folder;
        done();
      }
    });
  });

  afterEach(done =>
    fs
      .remove(storagePath)
      .then(done)
      .catch(done.fail)
  );

  describe('"run"', () => {
    it('deletes the specified target directory.', done => {
      const options = {
        cwd: process.cwd(),
      };
      options.targetDir = path.relative(options.cwd, storagePath);

      cleanTargetDir
        .run(options)
        .then(({result}) => {
          expect(result).toBe(storagePath);
          done();
        })
        .catch(done.fail);
    });
  });
});
