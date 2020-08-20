import { init, createPublicTokenProvider } from '../src/index';
import config from './config';
import renderConfigPanel from './config-panel';

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
  Object.assign(config, custom);
} catch (e) {
  console.log(`Error: ${e}`);
}

try {
  renderConfigPanel('controls');
  const customerId = Math.floor(Math.random() * 1000000);
  const tokenProvider = createPublicTokenProvider(config.apiUrl, config.apiKey, customerId);
  init(config, tokenProvider);
} catch (e) {
  console.log(`Error: ${e.message}`);
}
