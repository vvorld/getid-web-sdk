import renderConfigPanel from './config-panel';
import { init, createPublicTokenProvider } from '../src/index';

renderConfigPanel('controls', (config, customerId) => {
  const tokenProvider = createPublicTokenProvider(config.apiUrl, config.apiKey, customerId);
  init(config, tokenProvider);
});
