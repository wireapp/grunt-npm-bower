const npmBower = require('../tasks/npmBower');
const grunt = require('grunt');

describe('"bowerMigrate"', () => {
  it('registers as Grunt task.', () => {
    npmBower(grunt);
    expect(grunt.task._tasks['npmBower'].name).toBe('npmBower');
  });
});
