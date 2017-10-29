const path = require('path');

const parseBowerConfiguration = require('../../tasks/util/parseBowerConfiguration');

describe('"parseBowerConfiguration"', () => {
  it('loads a specified Bower configuration file.', done => {
    const options = {
      cwd: process.cwd(),
    };
    options.bowerConfig = path.relative(options.cwd, `${__dirname}/../fixtures/bower.json`);

    parseBowerConfiguration(options)
      .then(({result: config}) => {
        expect(config.settings.exportsOverride).toBeDefined();
        done();
      })
      .catch(done.fail);
  });
});
