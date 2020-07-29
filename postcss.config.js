const autoprefixer = require('postcss-prefixer');

module.exports = {
  plugins: [
    autoprefixer({
      prefix: 'getid-',
    }),
  ],
};
