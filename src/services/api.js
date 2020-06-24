import { createEAForSubmission } from '../helpers/request-formatter';

const createHeaders = (headers) => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  ...headers,
});

const postFormData = (url, formData) => fetch(url, {
  method: 'POST',
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: formData,
}).then((res) => res.json());

const post = (url, query, headers) => fetch(url, {
  method: 'POST',
  headers: createHeaders(headers),
  body: JSON.stringify(query),
}).then((res) => res.json());

const get = (url) => fetch(url, createHeaders())
  .then((res) => res.json());

export const createApi = (url, jwt, verificationTypes, metadata) => {
  const submitData = () => {
    const formData = createEAForSubmission(jwt, verificationTypes, metadata);
    return postFormData(`${url}/sdk/v1/verify-data`, formData);
  };

  const getInfo = () => post(`${url}/sdk/v1/configuration`, { jwt });
  const getCountryAndDocList = () => get(`${url}/sdk/v1/supported-documents`);
  const getTranslations = (dictionary) => post(`${url}/sdk/v1/dictionary`, { dictionary });
  const sendErrorToServer = (errorText, stack) => post(`${url}/sdk/v1/log-error`, { error: { errorText, stack } });
  const trySendEvent = async (step, stepPhase) => post(`${url}/sdk/v1/event`, { jwt, event: { stepPhase, step } })
    .catch(console.log);

  return {
    submitData, getInfo, getCountryAndDocList, trySendEvent, getTranslations, sendErrorToServer,
  };
};

export function getJwtToken(apiUrl, apiKey, customerId) {
  return post(`${apiUrl}/sdk/v1/token`, { customerId }, { apiKey });
}

export function getScriptLink(apiUrl, apiKey) {
  return post(`${apiUrl}/sdk/v1/script-link`, {}, { apiKey });
}
