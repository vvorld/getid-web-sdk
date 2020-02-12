import {
  COUNTRY_AND_DOC_LIST, VERIFICATION_REQUEST, VERIFY_JWT, EVENT, DICTIONARY, TOKEN_REQUEST,
} from '../constants/api';

const submitData = async (userData, jwt, url) => {
  try {
    const fetchResponse = await fetch(`${url}${VERIFICATION_REQUEST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ userData, jwt }),
    });
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

const getInfo = (jwt, url) => fetch(`${url}${VERIFY_JWT}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({ jwt }),
}).then((response) => response);


const getCountryAndDocList = (url) => fetch(`${url}${COUNTRY_AND_DOC_LIST}`, {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
}).then((response) => response);

const getTranslations = (url, dictionary) => fetch(`${url}${DICTIONARY}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({ dictionary }),
}).then((response) => response);

const sendEvent = async (url, step, stepPhase, jwt) => {
  try {
    const fetchResponse = await fetch(`${url}${EVENT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ jwt, event: { stepPhase, step } }),
    });
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

const checkApiKey = async (token, url, customerId) => fetch(`${url}${TOKEN_REQUEST}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    apiKey: token,
  },
  body: JSON.stringify({ customerId }),
}).then((response) => response);


export default {
  submitData, getInfo, getCountryAndDocList, sendEvent, getTranslations, checkApiKey,
};
