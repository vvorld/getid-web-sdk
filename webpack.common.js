const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/index.html',
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
};
