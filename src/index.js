import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import Widget from './layouts/Widget';
import TranslationsContext from './context/TranslationsContext';
import store from './store/store';
import createApiProvider from './services/api';
import defaultTranslations from './translations/default-translations.json';
import MainTheme from './assets/jss/MainTheme';
import { TOKEN_REQUEST } from './constants/api';

const supportedBrowsers = require('../supportedBrowsers');

if (!supportedBrowsers.test(navigator.userAgent)) {
  console.error('Your browser is not supported.');
}


const MainModule = (widgetOptions) => (
  <ThemeProvider theme={MainTheme}>
    <Provider store={store}>
      <TranslationsContext.Provider value={{ translations: widgetOptions.translations }}>
        <Widget
          {...widgetOptions}
        />
      </TranslationsContext.Provider>
    </Provider>
  </ThemeProvider>
);

/**
 * Renders main widget component
 * @param widgetOptions
 */
const renderMainComponent = (widgetOptions) => {
  ReactDOM.render(MainModule(widgetOptions), document.getElementById(widgetOptions.containerId));
};

export const createPublicTokenProvider = (apiUrl, apiKey, customerId) => () => {
  if (!apiUrl) {
    throw new Error('Missing api url');
  }
  if (!apiKey) {
    throw new Error('Missing api key');
  }
  if (!apiKey) {
    throw new Error('Missing customer id');
  }
  return fetch(`${apiUrl}${TOKEN_REQUEST}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      apiKey,
    },
    body: JSON.stringify({ customerId }),
  }).then((res) => res.json());
};

const checkProps = (options) => {
  const { containerId } = options;
  if (!containerId) {
    throw new Error('Please provide container id.');
  }
};


const getOkAnswer = (params) => (resp) => {
  if (resp.responseCode === 200) {
    if (params.field) {
      return resp[params.field];
    }
    return resp;
  }
  if (params.default !== undefined) {
    return params.default;
  }
  throw Error(resp.errorMessage);
};

/**
 * Init. Checks for token => returns the widget.
 * @param options
 * @param customerId
 */
export const init = (options, tokenProvider) => {
  checkProps(options);
  tokenProvider().then((result) => {
    const { responseCode, errorMessage, token, exists } = result;
    const api = createApiProvider(options.apiUrl, token);
    const config = {
      ...options, exists, api, translations: defaultTranslations, errorMessage,
    };
    if (responseCode !== 200 || exists) {
      renderMainComponent(config);
      return;
    }
    Promise.all([
      api.getInfo().then(getOkAnswer({ field: 'showOnfidoLogo' })),
      api.getTranslations(config.dictionary).then(getOkAnswer({ default: defaultTranslations })),
    ]).then(([showOnfidoLogo, translations]) => {
      renderMainComponent({ ...config, translations, showOnfidoLogo });
    });
  });
};
