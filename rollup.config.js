import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import urlResolver from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import * as react from 'react';
import * as reactDom from 'react-dom';
import * as reactIs from 'react-is';
import * as propTypes from 'prop-types';

const config = {
  input: 'src/index.js',
  output: [{
    name: 'getid-web-sdk',
    file: `${__dirname}/lib/bundle.js`,
    format: 'cjs',
  }],
  plugins: [resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/env', '@babel/preset-react'],
      plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'],
    }),
    postcss({ plugins: [] }),
    urlResolver(),
    json(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom),
        'react-is': Object.keys(reactIs),
        'prop-types': Object.keys(propTypes),
      },
    }),
  ],
};

export default config;
