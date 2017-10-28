const getOptions = require('../../tasks/util/getOptions');

describe('"getOptions"', () => {
  it('fails if no target directory is specified', done => {
    function optionsMock(defaults) {
      return Object.assign({}, defaults);
    }

    getOptions(optionsMock)
      .then(() => done.fail(new Error('Method is supposed to throw an error.')))
      .catch(error => {
        expect(error).toEqual(jasmine.any(Error));
        done();
      });
  });
});
