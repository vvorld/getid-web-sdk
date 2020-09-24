// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/polyfill');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/index.html',
    }),
  ],
  mode: 'development',
  devtool: 'source-map',
  entry: {
    demo: ['@babel/polyfill', './demo/index.js'],
  },
});
