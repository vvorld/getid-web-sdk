import { init, createPublicTokenProvider } from '../src/index';
import config from './config';

try {
  const customerId = 24;
  const tokenProvider = createPublicTokenProvider(config.apiUrl, config.apiKey, customerId);
  init(config, tokenProvider);
} catch (e) {
  console.log(`Error: ${e.message}`);
}
