const pkg = require('../package.json');

const cleanTargetDir = require('./util/cleanTargetDir');
const copyBowerComponents = require('./util/copyBowerComponents');
const getOptions = require('./util/getOptions');
const parseBowerConfiguration = require('./util/parseBowerConfiguration');

const PLUGIN_NAME = 'npmBower';
const PLUGIN_DESCRIPTION = pkg.description;

module.exports = grunt => {
  grunt.registerTask(PLUGIN_NAME, PLUGIN_DESCRIPTION, function() {
    const done = this.async();
    let options;

    return getOptions
      .run(this.options)
      .then(({message, result}) => {
        options = result;
        grunt.log.ok(message);
        if (options.cleanTargetDir) {
          return cleanTargetDir.run(options).then(({message}) => grunt.log.ok(message));
        }
      })
      .then(() => parseBowerConfiguration.run(options))
      .then(({message, result: bowerConfig}) => {
        grunt.log.ok(message);
        return copyBowerComponents.run(options, bowerConfig);
      })
      .then(({message}) => {
        grunt.log.ok(message);
        done();
      })
      .catch(error => {
        grunt.log.error(`Plugin failed: ${error.message}`);
        done(false);
      });
  });
};
