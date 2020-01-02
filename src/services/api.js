import { VERIFICATION_REQUEST, VERIFY_JWT, COUNTRY_AND_DOC_LIST } from '../constants/api';


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

export default {
  submitData, verifyJWT, getCountryAndDocList,
};
