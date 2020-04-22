// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/polyfill');

const merge = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  entry: {
    demo: ['@babel/polyfill', './demo/index.js'],
  },
});
