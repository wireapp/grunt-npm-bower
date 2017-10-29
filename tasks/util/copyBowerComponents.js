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
          const targetPath = path.join(targetDir, filePath);
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

function migrateDependencyNames(config) {
  let allDependencies = [];
  let migratedNames = [];

  for (const dependencyType of ['dependencies', 'devDependencies']) {
    if (config.settings[dependencyType]) {
      allDependencies = allDependencies.concat(Object.keys(config.settings[dependencyType]));
    }
  }

  if (config.type === CONFIG_TYPE.BOWER) {
    migratedNames = allDependencies.map(name => `${MIGRATION_PREFIX}${name}`);
  } else {
    migratedNames = allDependencies.filter(name => name.startsWith(MIGRATION_PREFIX));
  }

  return migratedNames.sort();
}

function migrateOverridePatterns(config, options) {
  const overridePatterns = config.settings[options.overrideProp] || {};
  let migratedPatterns = {};

  if (config.type === CONFIG_TYPE.BOWER) {
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
  const file = path.join(options.cwd, 'package.json');

  if (hasOverrides) {
    const message = chalk`Writing property "{yellowBright ${options.overrideProp}}" into "{blue ${options.verbose
      ? file
      : 'package.json'}}"...`;
    grunt.log.writeln(message);
    const packageJSON = grunt.file.readJSON(file);
    packageJSON[options.overrideProp] = Object.assign({}, packageJSON[options.overrideProp], migratedPatterns);
    grunt.file.write(file, JSON.stringify(packageJSON, null, 2));
  }
}

function run(options, config) {
  grunt.log.writeln(`Migrating dependency names and dependency overrides...`);

  const migratedNames = migrateDependencyNames(config);
  const migratedPatterns = migrateOverridePatterns(config, options);

  const message = logDependencyOverview(migratedNames, migratedPatterns);
  grunt.log.writeln(message);

  if (config.type === CONFIG_TYPE.BOWER) {
    writeMigrationsToPackageJSON(options, migratedPatterns);
  }

  // COPY
  const rootSourceDir = path.join(options.cwd, options.componentDir);
  const rootTargetDir = path.join(options.cwd, options.targetDir);

  grunt.log.writeln(
    chalk`Copying Bower components from "{blue ${options.verbose
      ? rootSourceDir
      : options.componentDir}}" to "{blue ${options.verbose ? rootTargetDir : options.targetDir}}".`
  );

  const promises = [];

  for (const packageName of migratedNames) {
    const sourceDir = path.join(rootSourceDir, packageName);
    const targetPackageName = options.resolveName ? resolveName(sourceDir, packageName) : packageName;

    // Dependencies with overrides
    if (Object.keys(migratedPatterns).indexOf(packageName) > -1) {
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
            config.pattern = patternEntry;
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

      promises.push(copyFiles(options, pathInfos));
    }
  }

  return Promise.all(promises).then(() => ({
    message: chalk`Copied Bower components from "{blue ${options.componentDir}}" to "{blue ${options.targetDir}}".`,
  }));
}

module.exports = {
  migrateDependencyNames,
  MIGRATION_PREFIX,
  run
};
