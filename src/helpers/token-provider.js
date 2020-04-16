import { getJwtToken } from '../services/api';

export const createPublicTokenProvider = (apiUrl, apiKey, customerId) => () => {
  if (!apiUrl) {
    throw new Error('Missing api url');
  }
  if (!apiKey) {
    throw new Error('Missing api key');
  }
  return getJwtToken(apiUrl, apiKey, customerId);
};
