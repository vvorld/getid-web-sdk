import { init, createPublicTokenProvider } from '../src/index';
import config from './config';

try {
  // You can use custom.js for customising config object
  // Example:
  //
  // export default {
  //   apiUrl: 'http://localhost:3001',
  //   sdkKey: '1231223',
  // };

  // eslint-disable-next-line global-require
  const custom = require('./custom.js').default;
  Object.assign(config, custom);
} catch (e) {
  console.log(`Error: ${e}`);
}

try {
  const customerId = Math.floor(Math.random() * 1000000);
  const tokenProvider = createPublicTokenProvider(config.apiUrl, config.sdkKey, customerId);
  init(config, tokenProvider);
} catch (e) {
  console.log(`Error: ${e.message}`);
}
