const merge = require('webpack-merge');
const path = require('path');
const S3Plugin = require('webpack-s3-plugin');
const common = require('./webpack.common.js');
const config = require('./do-config.js');

module.exports = merge(common, {
  mode: 'production',
  entry: path.join(__dirname, 'src'),
  plugins: [
    new S3Plugin({
      exclude: /.*\.html|js|LICENSE/,
      basePath: 'assets',
      include: /.*\.(svg)/,
      s3Options: {
        endpoint: config.bucketUrl,
        accessKeyId: config.bucketAccessKeyId,
        secretAccessKey: config.bucketSecret,
        region: 'FRA-1',
      },
      s3UploadOptions: {
        Bucket: config.bucketName,
      },
      cdnizerOptions: {
        defaultCDNBase: config.bucketUrl,
      },
      directory: path.resolve(__dirname, 'src/assets/animations'),
    }),
  ],
});
