module.exports = {
  entry: './test/test-module.js',
  output: {
    path: './test/bin/',
    filename: 'test-module.build.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};


