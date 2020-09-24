const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.[tj]s'],
  webpackFinal: (config) => {
    config.resolve.alias['~'] = path.resolve(__dirname, '../src');
    return config;
  },
};
