const chalk = require('chalk');
const grunt = require('grunt');

function verifyOptions(options, requiredOptions) {
  requiredOptions.forEach(option => {
    if (!options[option]) {
      throw new Error(`Missing option "${option}".`);
    }
  });
}

module.exports = customOptions => {
  grunt.log.writeln(`Parsing task options...`);

  const defaults = {
    bowerConfig: 'bower.json',
    bowerDir: 'node_modules',
    cleanTargetDir: false,
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
      result: options
    }));
};
