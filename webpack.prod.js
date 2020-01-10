const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    'getid-web-sdk': ['@babel/polyfill', './src/index.js'],
  },
  output: {
    library: 'getidWebSdk',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: false,
        ecma: 5,
        mangle: true,
      },
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
