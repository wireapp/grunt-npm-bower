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
const glob = require('glob');
const grunt = require('grunt');
const path = require('path');
const fs = require('fs-extra');

const CONFIG_TYPE = require('./CONFIG_TYPE');
const MIGRATION_PREFIX = '@bower_components/';

function copyFiles(options, {pattern, sourceDir, targetDir}) {
  return new Promise(function(resolve, reject) {
    glob(pattern, {cwd: sourceDir}, function(error, files) {
      if (!error) {
        const copyTasks = [];
        const logger = options.verbose ? grunt.log : grunt.verbose;

        files.forEach(filePath => {
          const sourcePath = path.join(sourceDir, filePath);
          const targetPath = path.join(targetDir, path.basename(filePath));
          const message = chalk`Copied file from "{blue ${sourcePath}}" to "{blue ${targetPath}}".`;
          copyTasks.push(fs.copy(sourcePath, targetPath).then(() => logger.writeln(message)));
        });

        Promise.all(copyTasks).then(resolve);
      } else {
        reject(new Error(`Pattern "${pattern}" is invalid: ${error.message}`));
      }
    });
  });
}

function migrateDependencyNames(config, type) {
  let allDependencies = [];
  let migratedNames = [];

  for (const dependencyType of ['dependencies', 'devDependencies']) {
    if (config[dependencyType]) {
      allDependencies = allDependencies.concat(Object.keys(config[dependencyType]));
    }
  }

  if (type === CONFIG_TYPE.BOWER) {
    migratedNames = allDependencies.map(name => `${MIGRATION_PREFIX}${name}`);
  } else {
    migratedNames = allDependencies.filter(name => name.startsWith(MIGRATION_PREFIX));
  }

  return migratedNames.sort();
}

function migrateOverridePatterns(config, type, options) {
  const overridePatterns = config[options.overrideProp] || {};
  let migratedPatterns = {};

  if (type === CONFIG_TYPE.BOWER) {
    for (const name in overridePatterns) {
      const pattern = overridePatterns[name];
      migratedPatterns[`${MIGRATION_PREFIX}${name}`] = pattern;
    }
  } else {
    for (const name in overridePatterns) {
      const pattern = overridePatterns[name];
      if (name.startsWith(MIGRATION_PREFIX)) {
        migratedPatterns[name] = pattern;
      }
    }
  }

  return migratedPatterns;
}

function logDependencyOverview(migratedNames, migratedPatterns) {
  let logDependencies = 'Bower dependencies: ';

  migratedNames.forEach(name => {
    if (Object.keys(migratedPatterns).indexOf(name) > -1) {
      logDependencies += `${chalk.yellowBright(name)}, `;
    } else {
      logDependencies += `${chalk.blue(name)}, `;
    }
  });

  return logDependencies.substr(0, logDependencies.length - 2);
}

function resolveName(sourceDir, packageName) {
  const candidates = [
    path.join(sourceDir, '.bower.json'),
    path.join(sourceDir, 'bower.json'),
    path.join(sourceDir, 'package.json'),
  ];

  let name = packageName;
  if (name.startsWith(MIGRATION_PREFIX)) {
    name = name.substr(MIGRATION_PREFIX.length);
  }

  for (let i = 0; i < candidates.length; i++) {
    try {
      const descriptor = grunt.file.readJSON(candidates[i]);
      name = descriptor.name;
      break;
    } catch (error) {
      continue;
    }
  }

  return name;
}

function writeMigrationsToPackageJSON(options, migratedPatterns) {
  const hasOverrides = Object.keys(migratedPatterns).length > 0;
  const file = path.join(options.cwd, options.npmConfig);

  if (hasOverrides) {
    const message = chalk`Writing property "{yellowBright ${options.overrideProp}}" into "{blue ${options.verbose
      ? file
      : options.npmConfig}}"...`;
    grunt.log.writeln(message);
    const packageJSON = grunt.file.readJSON(file);
    packageJSON[options.overrideProp] = Object.assign({}, packageJSON[options.overrideProp], migratedPatterns);
    grunt.file.write(file, JSON.stringify(packageJSON, null, 2));
  }
}

function copyBowerComponentsToTargetDir(options, migratedNames, migratedPatterns) {
  const rootSourceDir = path.join(options.cwd, options.componentDir);
  const rootTargetDir = path.join(options.cwd, options.targetDir);

  grunt.log.writeln(
    chalk`Copying Bower components from "{blue ${options.verbose
      ? rootSourceDir
      : options.componentDir}}" to "{blue ${options.verbose ? rootTargetDir : options.targetDir}}".`
  );

  const promises = [];

  for (const packageName of migratedNames) {
    const logger = options.verbose ? grunt.log : grunt.verbose;
    logger.writeln(chalk`Processing "{blue ${packageName}}"...`);

    const sourceDir = path.join(rootSourceDir, packageName);
    const targetPackageName = options.resolveName ? resolveName(sourceDir, packageName) : packageName;

    const hasOverridePattern = Object.keys(migratedPatterns).indexOf(packageName) > -1;
    if (hasOverridePattern) {
      const payload = migratedPatterns[packageName];
      for (const type in payload) {
        const pattern = payload[type];
        const pathInfos = {
          pattern,
          sourceDir,
          targetDir: path.join(rootTargetDir, type, targetPackageName),
        };

        if (typeof pattern === 'string') {
          promises.push(copyFiles(options, pathInfos));
        } else if (pattern instanceof Array) {
          pattern.forEach(patternEntry => {
            pathInfos.pattern = patternEntry;
            promises.push(copyFiles(options, pathInfos));
          });
        }
      }
    } else {
      const pathInfos = {
        pattern: '**/*.*',
        sourceDir,
        targetDir: path.join(rootTargetDir, targetPackageName),
      };

      promises.push(() => {
        return copyFiles(options, pathInfos);
      });
    }
  }

  return Promise.all(promises);
}

function run(options, config) {
  grunt.log.writeln(`Migrating dependency names and dependency overrides...`);

  const migratedNames = migrateDependencyNames(config[CONFIG_TYPE.BOWER]).concat(
    migrateDependencyNames(config[CONFIG_TYPE.NPM])
  );
  const migratedPatterns = Object.assign(
    {},
    migrateOverridePatterns(config[CONFIG_TYPE.BOWER], CONFIG_TYPE.BOWER, options),
    migrateOverridePatterns(config[CONFIG_TYPE.NPM], CONFIG_TYPE.NPM, options)
  );

  const message = logDependencyOverview(migratedNames, migratedPatterns);
  grunt.log.writeln(message);

  if (config.type === CONFIG_TYPE.BOWER) {
    writeMigrationsToPackageJSON(options, migratedPatterns);
  }

  return copyBowerComponentsToTargetDir(options, migratedNames, migratedPatterns).then(() => ({
    message: chalk`Copied Bower components from "{blue ${options.componentDir}}" to "{blue ${options.targetDir}}".`,
  }));
}

module.exports = {
  migrateDependencyNames,
  MIGRATION_PREFIX,
  run,
};
