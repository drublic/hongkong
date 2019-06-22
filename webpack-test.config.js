const path = require('path');

module.exports = {
  mode: 'development',
  entry: './test/test-module.js',
  output: {
    path: path.resolve('./test/bin/'),
    filename: 'test-module.build.js'
  },
};
