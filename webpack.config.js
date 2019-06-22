const path = require('path');

module.exports = {
  mode: 'production',
  entry: './hongkong.js',
  output: {
    path: path.resolve('./bin'),
    filename: 'hongkong.min.js'
  },
};
