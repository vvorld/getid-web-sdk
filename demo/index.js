import config from './config';

const TOKEN_REQUEST = '/sdk/token';

const localConfig = config;

/**
 * This function calls BE token method to check token validity and return JWT
 * @param token
 * @param url
 * @returns {Promise<>}
 */
const checkApiKey = async (token, url) => fetch(`${url}${TOKEN_REQUEST}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({ apiKey: token }),
}).then((response) => response);


// this request should be done from BE
const apiKey = '';
const getJWTToken = () => checkApiKey(apiKey, config.apiUrl)
    .then((res) => res.json())
    .then((data) => {
        if (data.responseCode !== 200) throw new Error(data.errorMessage);
        Object.assign(localConfig, { jwtToken: data.token });
        return data;
    });


// testing
getJWTToken().then(() => {
  getidWebSdk.init(localConfig);
}).catch((e) => {
  console.log(`Error: ${e.message}`);
});
