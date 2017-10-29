const path = require('path');

const copyBowerComponents = require('../../tasks/util/copyBowerComponents');
const CONFIG_TYPE = require('../../tasks/util/CONFIG_TYPE');

describe('copyBowerComponents', () => {

  describe('"migrateDependencyNames"', () => {
    it('prefixes package names.', () => {
      const config = {
        settings: {
          "dependencies": {
            "amplify": "https://github.com/wireapp/amplify.git#1.1.5",
          }
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
          "dependencies": {
            "amplify": "https://github.com/wireapp/amplify.git#1.1.5",
          },
          "devDependencies": {
            "logdown": "2.2.0"
          }
        },
        type: CONFIG_TYPE.BOWER,
      };

      const migratedNames = copyBowerComponents.migrateDependencyNames(config);
      expect(Object.keys(migratedNames).length).toBe(2);
    });
  });

});
