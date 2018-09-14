var path = require('path');

module.exports = {
  entry: './pages/index.js',
  output: {
    path: path.join(__dirname, 'scripts'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{ test: /\.json$/, loader: 'json-loader' }]
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js']
  },
  node: {
    fs: 'empty',
    tls: 'empty'
  }
};