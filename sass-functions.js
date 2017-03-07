module.exports = {
  myUrl: function(string, done) {
    console.log('string.getValue():', string.getValue());  // eslint-disable-line no-console
    console.log('done:', done);  // eslint-disable-line no-console
    return 'asdf';
  },
};
