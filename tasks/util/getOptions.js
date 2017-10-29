const chalk = require('chalk');
const grunt = require('grunt');

function verifyOptions(options, requiredOptions) {
  requiredOptions.forEach(option => {
    if (!options[option]) {
      throw new Error(`Missing option "${option}".`);
    }
  });
}

function run(customOptions) {
  grunt.log.writeln(`Parsing task options...`);

  const defaults = {
    bowerConfig: 'bower.json',
    cleanTargetDir: false,
    componentDir: 'node_modules',
    overrideProp: 'exportsOverride',
    resolveName: true,
    verbose: false,
  };

  const required = ['targetDir'];

  const options = customOptions(defaults);
  options.cwd = grunt.option('base') || process.cwd();

  return Promise.resolve()
    .then(() => verifyOptions(options, required))
    .then(() => ({
      message: chalk`Options: {blue ${JSON.stringify(options)}}`,
      result: options,
    }));
}

module.exports = {
  run,
};
