module.exports = grunt => {
  grunt.initConfig({
    npmBower: {
      options: {
        bowerConfig: './spec/fixtures/bower.json',
        bowerDir: './test/bower_components',
        cleanTargetDir: true,
        resolveName: true,
        targetDir: './temp',
        verbose: true,
      },
    },
  });

  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['npmBower']);
};
