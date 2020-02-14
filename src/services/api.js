import {
  COUNTRY_AND_DOC_LIST, VERIFICATION_REQUEST, VERIFY_JWT, EVENT, DICTIONARY,
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

const createApi = (url, jwt) => {
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

  return { submitData, getInfo, getCountryAndDocList, sendEvent, getTranslations };
};

export default createApi;
