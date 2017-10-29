module.exports = grunt => {
  grunt.initConfig({
    npmBower: {
      options: {
        bowerConfig: './spec/fixtures/bower.json',
        cleanTargetDir: true,
        componentDir: './node_modules',
        overrideProp: 'exportsOverride',
        resolveName: true,
        targetDir: './temp',
        verbose: true,
      },
    },
  });

  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['npmBower']);
};
