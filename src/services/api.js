import {
  COUNTRY_AND_DOC_LIST, VERIFICATION_REQUEST, VERIFY_JWT,
  EVENT, DICTIONARY, TOKEN_REQUEST, PERMISSIONS,
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

  const getInfo = () => post(`${url}${VERIFY_JWT}`, { jwt });
  const getCountryAndDocList = () => get(`${url}${COUNTRY_AND_DOC_LIST}`);
  const getTranslations = (dictionary) => post(`${url}${DICTIONARY}`, { dictionary });

  const trySendEvent = async (step, stepPhase) => {
    try {
      await post(`${url}${EVENT}`, { jwt, event: { stepPhase, step } });
    } catch (e) {
      console.log(e);
    }
  };

  const getPermissions = () => post(`${url}${PERMISSIONS}`, { jwt });
  return {
    submitData, getInfo, getCountryAndDocList, trySendEvent, getTranslations, getPermissions,
  };
};

export function getJwtToken(apiUrl, apiKey, customerId) {
  return post(`${apiUrl}${TOKEN_REQUEST}`, { customerId }, { apiKey });
}
