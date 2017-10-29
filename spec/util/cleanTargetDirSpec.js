const fs = require('fs-extra');
const path = require('path');

const cleanTargetDir = require('../../tasks/util/cleanTargetDir');

describe('cleanTargetDir', () => {
  let storagePath = undefined;

  beforeEach(done => {
    fs.mkdtemp(path.join(__dirname, 'test-'), (error, folder) => {
      if (error) {
        done.fail(error);
      } else {
        storagePath = folder;
        done();
      }
    });
  });

  afterEach(done =>
    fs
      .remove(storagePath)
      .then(done)
      .catch(done.fail)
  );

  describe('"run"', () => {
    it('deletes the specified target directory.', done => {
      const options = {
        cwd: process.cwd(),
      };
      options.targetDir = path.relative(options.cwd, storagePath);

      cleanTargetDir
        .run(options)
        .then(({result}) => {
          expect(result).toBe(storagePath);
          done();
        })
        .catch(done.fail);
    });
  });
});
