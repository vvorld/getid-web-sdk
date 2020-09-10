const createHeaders = (headers) => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  ...headers,
});

const postFormData = (url, body, token) => fetch(url, {
  method: 'POST',
  headers: {
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${token}`,
  },
  body,
}).then((res) => res.json());

const post = (url, query, headers) => fetch(url, {
  method: 'POST',
  headers: createHeaders(headers),
  body: JSON.stringify(query),
}).then((res) => res.json());

const get = (url) => fetch(url, createHeaders())
  .then((res) => res.json());

export const createApi = (url, jwt, metadata) => {
  const submitData = (userData, files) => {
    const form = new FormData();
    form.append('data', JSON.stringify({
      userData,
      jwt,
    }));
    Object.entries(files).forEach(([name, blob]) => blob && form.append(name, blob));
    return postFormData(`${url}/sdk/v1/verify-data`, form);
  };

  const getInfo = () => post(`${url}/sdk/v1/configuration`, { jwt });
  const getCountryAndDocList = () => get(`${url}/sdk/v1/supported-documents`);
  const getTranslations = (dictionary) => post(`${url}/sdk/v1/dictionary`, { dictionary });
  const sendErrorToServer = (errorText, stack) => post(`${url}/sdk/v1/log-error`, { error: { errorText, stack } });
  const verifyToken = () => post(`${url}/sdk/v1/verify-token`, { jwt });
  const trySendEvent = async (step, stepPhase) => post(`${url}/sdk/v1/event`, { jwt, event: { stepPhase, step, metadata } })
    .catch(console.log);

  const checkSide = async (front, back) => {
    const form = new FormData();
    if (front) {
      form.append('front', front, 'front');
    }
    if (back) {
      form.append('back', back, 'back');
    }
    return postFormData(`${url}/sdk/v1/document`, form, jwt);
  };

  const checkSelfie = async (selfie) => {
    const form = new FormData();
    if (selfie) {
      form.append('selfie', selfie, 'selfie');
    }
    return postFormData(`${url}/sdk/v1/selfie`, form, jwt);
  };

  return {
    submitData,
    getInfo,
    getCountryAndDocList,
    trySendEvent,
    getTranslations,
    sendErrorToServer,
    checkSide,
    checkSelfie,
    verifyToken,
  };
};

export function getJwtToken(apiUrl, apiKey, customerId) {
  return post(`${apiUrl}/sdk/v1/token`, { customerId }, { apiKey });
}

export function getScriptLink(apiUrl, apiKey) {
  return post(`${apiUrl}/sdk/v1/script-link`, {}, { apiKey });
}

export function getApiVersions(apiUrl) {
  return get(`${apiUrl}/sdk/versions`);
}
