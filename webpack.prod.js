const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const common = require('./webpack.common.js');
const { version } = require('./package');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    'getid-web-sdk': './src/index.js',
  },
  output: {
    library: 'getidWebSdk',
    path: path.resolve(__dirname, 'dist/lib/'),
    filename: `[name]-v${version}.min.js`,
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
