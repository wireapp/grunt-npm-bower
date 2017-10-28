const chalk = require('chalk');
const grunt = require('grunt');
const path = require('path');

module.exports = options => {
  grunt.log.writeln(`Validating "${chalk.blue(options.bowerConfig)}"...`);

  const bowerConfigPath = path.join(options.cwd, options.bowerConfig);
  const bowerConfig = grunt.file.readJSON(bowerConfigPath);

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
      result: bowerConfig,
    };
  });
};
