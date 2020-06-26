const merge = require('webpack-merge');
const path = require('path');
const S3Plugin = require('webpack-s3-plugin');
const common = require('./webpack.common.js');
const config = require('./do-config.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  plugins: [
    new CleanWebpackPlugin(),
    new S3Plugin({
      exclude: /.*\.html|svg|LICENSE/,
      basePath: 'sdk',
      include: /.*\.(js)/,
      s3Options: {
        endpoint: config.bucketUrl,
        accessKeyId: config.bucketAccessKeyId,
        secretAccessKey: config.bucketSecret,
        region: 'FRA-1',
      },
      s3UploadOptions: {
        Bucket: config.bucketName,
      },
      directory: path.resolve(__dirname, 'dist/lib'),
    }),
  ],
});
