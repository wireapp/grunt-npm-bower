const pkg = require('../package.json');

const cleanTargetDir = require('./util/cleanTargetDir');
const getOptions = require('./util/getOptions');

const PLUGIN_NAME = 'npmBower';
const PLUGIN_DESCRIPTION = pkg.description;

module.exports = grunt => {
  grunt.registerTask(PLUGIN_NAME, PLUGIN_DESCRIPTION, function() {
    const done = this.async();
    let options;

    return Promise.resolve()
      .then(() => getOptions(this.options))
      .then(({message, result}) => {
        options = result;
        grunt.log.ok(message);
        if (options.cleanTargetDir) {
          return cleanTargetDir(options).then(({message}) => grunt.log.ok(message))
        }
      })
      .then(() => {
        done();
      })
      .catch(error => {
        grunt.log.error(`Plugin failed: ${error.message}`);
        done(false);
      });
  });
};
