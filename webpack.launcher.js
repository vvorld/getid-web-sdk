const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    launcher: './src/launcher.js',
  },
  output: {
    library: 'getidWebSdk',
    path: path.resolve(__dirname, 'dist/launcher/'),
    filename: '[name].min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      cache: true,
      parallel: 4,
      sourceMap: true,
    }),
    ],
  },
});

