const chalk = require('chalk');
const grunt = require('grunt');

const DEFAULT_OPTIONS = {
  bowerConfig: 'bower.json',
  cleanTargetDir: false,
  componentDir: 'node_modules',
  overrideProp: 'exportsOverride',
  resolveName: true,
  verbose: false,
};

const REQUIRED_OPTIONS = ['targetDir'];

function verifyOptions(options, requiredOptions) {
  requiredOptions.forEach(option => {
    if (!options[option]) {
      throw new Error(`Missing option "${option}".`);
    }
  });
}

function run(customOptions) {
  grunt.log.writeln(`Parsing task options...`);

  const options = customOptions(DEFAULT_OPTIONS);
  options.cwd = grunt.option('base') || process.cwd();

  return Promise.resolve()
    .then(() => verifyOptions(options, REQUIRED_OPTIONS))
    .then(() => ({
      message: chalk`Options: {blue ${JSON.stringify(options)}}`,
      result: options,
    }));
}

module.exports = {
  DEFAULT_OPTIONS,
  REQUIRED_OPTIONS,
  run,
};
