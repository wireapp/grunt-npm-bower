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

const copyBowerComponents = require('../../tasks/util/copyBowerComponents');
const CONFIG_TYPE = require('../../tasks/util/CONFIG_TYPE');

describe('copyBowerComponents', () => {
  describe('"migrateDependencyNames"', () => {
    it('prefixes package names.', () => {
      const config = {
        [CONFIG_TYPE.BOWER]: {
          dependencies: {
            amplify: 'https://github.com/wireapp/amplify.git#1.1.5',
          },
        },
      };

      const packageName = Object.keys(config[CONFIG_TYPE.BOWER].dependencies)[0];
      const expectedName = `${copyBowerComponents.MIGRATION_PREFIX}${packageName}`;

      const bowerConfig = config[CONFIG_TYPE.BOWER];
      const migratedNames = copyBowerComponents.migrateDependencyNames(bowerConfig, CONFIG_TYPE.BOWER);
      expect(Object.keys(migratedNames).length).toBe(1);
      expect(migratedNames[0]).toBe(expectedName);
    });

    it('concatenates dependencies and development dependencies.', () => {
      const config = {
        [CONFIG_TYPE.BOWER]: {
          dependencies: {
            amplify: 'https://github.com/wireapp/amplify.git#1.1.5',
          },
          devDependencies: {
            logdown: '2.2.0',
          },
        },
      };

      const bowerConfig = config[CONFIG_TYPE.BOWER];
      const migratedNames = copyBowerComponents.migrateDependencyNames(bowerConfig, CONFIG_TYPE.BOWER);
      expect(Object.keys(migratedNames).length).toBe(2);
    });
  });
});
