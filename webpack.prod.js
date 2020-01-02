const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    'getid-web-sdk': './src/index.js',
  },
  output: {
    library: 'getidWebSdk',
    path: path.resolve(__dirname, 'dist'),
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
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: `${__dirname}/dist/reports/bundle_getid-sdk_size.html`,
      defaultSizes: 'parsed',
    }),
  ],
});
