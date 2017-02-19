module.exports = {
  entry: './hongkong.js',
  output: {
    path: './bin',
    filename: 'hongkong.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
