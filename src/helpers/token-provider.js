import { getJwtToken } from '../services/api';

export const createPublicTokenProvider = (apiUrl, sdkKey, customerId) => () => {
  if (!apiUrl) {
    throw new Error('Missing api url');
  }
  if (!sdkKey) {
    throw new Error('Missing api key');
  }
  return getJwtToken(apiUrl, sdkKey, customerId);
};
