import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { init, createPublicTokenProvider } from '../src/index';
import config from './config';

const cfg = { ...config };
try {
  // You can use custom.js for customising config object
  // Example:
  //
  // export default {
  //   apiUrl: 'http://localhost:3001',
  //   apiKey: '1231223',
  // };

  // eslint-disable-next-line global-require
  const custom = require('./custom.js').default;
  Object.assign(cfg, custom);
} catch (e) {
  console.log(`Error: ${e}`);
}

try {
  const customerId = Math.floor(Math.random() * 1000000);
  const tokenProvider = createPublicTokenProvider(cfg.apiUrl, cfg.apiKey, customerId);
  init(cfg, tokenProvider);
} catch (e) {
  console.log(`Error: ${e.message}`);
}
