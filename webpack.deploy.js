const merge = require('webpack-merge');
const path = require('path');
const S3Plugin = require('webpack-s3-plugin');
const common = require('./webpack.common.js');
const config = require('./do-config.js');

module.exports = merge(common, {
  plugins: [
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
        CacheControl: 'random',
      },
      directory: path.resolve(__dirname, 'dist/lib'),
    }),
  ],
});
