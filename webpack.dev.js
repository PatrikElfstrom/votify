const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080',
      cookieDomainRewrite: 'localhost',
    },
  },
});
