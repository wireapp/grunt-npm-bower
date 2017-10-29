const chalk = require('chalk');
const fs = require('fs-extra');
const grunt = require('grunt');
const path = require('path');

function run(options) {
  grunt.log.writeln(`Removing directory "${chalk.blue(options.targetDir)}"...`);
  const targetDir = path.join(options.cwd, options.targetDir);

  return fs.remove(targetDir).then(() => {
    return {
      message: chalk`Removed directory "{blue ${options.verbose ? targetDir : options.targetDir}}".`,
      result: path.normalize(targetDir),
    };
  });
}

module.exports = {
  run,
};
