import { init } from '../src/index';
import config from './config';

try {
  init(config, 5);
} catch (e) {
  console.log(`Error: ${e.message}`);
}
