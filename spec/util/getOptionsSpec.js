const getOptions = require('../../tasks/util/getOptions');

describe('getOptions', () => {
  describe('"run"', () => {
    it('fails if no target directory is specified', done => {
      function optionsMock(defaults) {
        return Object.assign({}, defaults);
      }

      getOptions
        .run(optionsMock)
        .then(() => done.fail(new Error('Method is supposed to throw an error.')))
        .catch(error => {
          expect(error).toEqual(jasmine.any(Error));
          done();
        });
    });
  });
});
