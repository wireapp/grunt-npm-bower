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
        settings: {
          dependencies: {
            amplify: 'https://github.com/wireapp/amplify.git#1.1.5',
          },
        },
        type: CONFIG_TYPE.BOWER,
      };

      const packageName = Object.keys(config.settings.dependencies)[0];
      const expectedName = `${copyBowerComponents.MIGRATION_PREFIX}${packageName}`;

      const migratedNames = copyBowerComponents.migrateDependencyNames(config);
      expect(Object.keys(migratedNames).length).toBe(1);
      expect(migratedNames[0]).toBe(expectedName);
    });

    it('concatenates dependencies and development dependencies.', () => {
      const config = {
        settings: {
          dependencies: {
            amplify: 'https://github.com/wireapp/amplify.git#1.1.5',
          },
          devDependencies: {
            logdown: '2.2.0',
          },
        },
        type: CONFIG_TYPE.BOWER,
      };

      const migratedNames = copyBowerComponents.migrateDependencyNames(config);
      expect(Object.keys(migratedNames).length).toBe(2);
    });
  });
});
