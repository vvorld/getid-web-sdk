import {
  COUNTRY_AND_DOC_LIST, VERIFICATION_REQUEST, VERIFY_JWT, EVENT, DICTIONARY, TOKEN_REQUEST,
} from '../constants/api';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const post = (url, query) => fetch(url, {
  method: 'POST',
  headers,
  body: JSON.stringify(query),
}).then((res) => res.json());

const get = (url) => fetch(url, { headers })
  .then((res) => res.json());

export const createApi = (url, jwt) => {
  const submitData = async (userData) => {
    try {
      return await post(`${url}${VERIFICATION_REQUEST}`, { userData, jwt });
    } catch (e) {
      return e;
    }
  };

  const getInfo = () => post(`${url}${VERIFY_JWT}`, { jwt });
  const getCountryAndDocList = () => get(`${url}${COUNTRY_AND_DOC_LIST}`);
  const getTranslations = (dictionary) => post(`${url}${DICTIONARY}`, { dictionary });

  const sendEvent = async (step, stepPhase) => {
    try {
      return await post(`${url}${EVENT}`, { jwt, event: { stepPhase, step } });
    } catch (e) {
      return e;
    }
  };

  return {
    submitData, getInfo, getCountryAndDocList, sendEvent, getTranslations,
  };
};


export function getJwtToken(apiUrl, apiKey, customerId) {
  return fetch(`${apiUrl}${TOKEN_REQUEST}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      apiKey,
    },
    body: JSON.stringify({ customerId }),
  }).then((res) => res.json());
}
