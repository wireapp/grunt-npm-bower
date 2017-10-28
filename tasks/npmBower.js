const pkg = require('../package.json');

const getOptions = require('./util/getOptions');

const PLUGIN_NAME = 'npmBower';
const PLUGIN_DESCRIPTION = pkg.description;

module.exports = grunt => {
  grunt.registerTask(PLUGIN_NAME, PLUGIN_DESCRIPTION, function() {
    const done = this.async();

    return Promise.resolve()
      .then(() => getOptions(this.options))
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
