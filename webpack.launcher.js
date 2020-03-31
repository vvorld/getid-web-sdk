const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    launcher: './src/launcher.js',
  },
  output: {
    library: 'getIdLauncher',
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
};
