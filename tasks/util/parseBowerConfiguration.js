const chalk = require('chalk');
const grunt = require('grunt');
const path = require('path');

const CONFIG_TYPE = require('./CONFIG_TYPE');

module.exports = options => {
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
};
