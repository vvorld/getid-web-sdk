import {
  COUNTRY_AND_DOC_LIST, VERIFICATION_REQUEST, VERIFY_JWT, EVENT,
} from '../constants/api';


const submitData = (userData, jwt, url) => fetch(`${url}${VERIFICATION_REQUEST}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({ userData, jwt }),
}).then((response) => response);

const verifyJWT = (jwt, url) => fetch(`${url}${VERIFY_JWT}`, {
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

export default {
  submitData, verifyJWT, getCountryAndDocList, sendEvent,
};
