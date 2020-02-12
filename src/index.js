import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import Widget from './layouts/Widget';
import TranslationsContext from './context/TranslationsContext';
import store from './store/store';
import apiProvider from './services/api';
import defaultTranslations from './translations/default-translations.json';
import MainTheme from './assets/jss/MainTheme';

const supportedBrowsers = require('../supportedBrowsers');

if (!supportedBrowsers.test(navigator.userAgent)) {
  console.error('Your browser is not supported.');
}

const getTranslations = (url, dictionary) => apiProvider.getTranslations(url, dictionary)
  .then((res) => res.json())
  .then((data) => {
    const { responseCode, translations } = data;
    if (responseCode !== 200) { return defaultTranslations; }
    return translations;
  });

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


const getJWTToken = (config, customerId) => {
  const { apiUrl, apiKey } = config;
  return apiProvider
    .checkApiKey(apiKey, apiUrl, customerId)
    .then((res) => res.json()
      .then((data) => {
        const { responseCode, errorMessage } = data;
        if (responseCode === 200 || responseCode === 400) { return data; }

        throw new Error(errorMessage);
      }));
};

const getInfoAndRender = (args) => {
  const { jwtToken, apiUrl, dictionary } = args;

  apiProvider.getInfo(jwtToken, apiUrl)
    .then((res) => res
      .json())
    .then((data) => {
      const { responseCode, errorMessage, showOnfidoLogo } = data;

      if (responseCode !== 200) { throw new Error(` ${errorMessage}`); }

      getTranslations(apiUrl, dictionary)
        .then((result) => {
          renderMainComponent({ ...args, translations: result, showOnfidoLogo });
        });
    });
};

const checkProps = (options) => {
  const { apiUrl, apiKey, containerId } = options;

  if (!apiKey || !apiUrl) {
    throw new Error('Missing credentials');
  }

  if (!containerId) {
    throw new Error('Please provide container id.');
  }
};

/**
 * Init. Checks for token => returns the widget.
 * @param options
 * @param customerId
 */
export const init = (options, customerId) => {
  checkProps(options);

  getJWTToken(options, customerId).then((result) => {
    const { token, exists } = result;
    if (exists) {
      const config = {
        ...options, exists, translations: defaultTranslations,
      };
      renderMainComponent({ ...config });
      return;
    }

    const config = { ...options, jwtToken: token };
    getInfoAndRender(config);
  });
};
