import {
  COUNTRY_AND_DOC_LIST, VERIFICATION_REQUEST, CONFIGURATION,
  EVENT, DICTIONARY, TOKEN_REQUEST, LOG_ERROR,
} from '../constants/api';
import { createEAForSubmission } from '../helpers/tree-builder';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const postFormData = (url, formData) => fetch(url, {
  method: 'POST',
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: formData,
}).then((res) => res.json());

const post = (url, query, headers) => fetch(url, {
  method: 'POST',
  headers: { ...defaultHeaders, ...headers },
  body: JSON.stringify(query),
}).then((res) => res.json());

const get = (url) => fetch(url, { ...defaultHeaders })
  .then((res) => res.json());

export const createApi = (url, jwt) => {
  const submitData = () => {
    const formData = createEAForSubmission(jwt);
    return postFormData(`${url}${VERIFICATION_REQUEST}`, formData);
  };

  const getInfo = () => post(`${url}${CONFIGURATION}`, { jwt });
  const getCountryAndDocList = () => get(`${url}${COUNTRY_AND_DOC_LIST}`);
  const getTranslations = (dictionary) => post(`${url}${DICTIONARY}`, { dictionary });

  const trySendEvent = async (step, stepPhase) => {
    try {
      await post(`${url}${EVENT}`, { jwt, event: { stepPhase, step } });
    } catch (e) {
      console.log(e);
    }
  };

  const sendErrorToServer = (errorText, stack) => post(`${url}${LOG_ERROR}`, { error: { errorText, stack } });

  return {
    submitData, getInfo, getCountryAndDocList, trySendEvent, getTranslations, sendErrorToServer,
  };
};

export function getJwtToken(apiUrl, apiKey, customerId) {
  return post(`${apiUrl}${TOKEN_REQUEST}`, { customerId }, { apiKey });
}
