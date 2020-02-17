import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import Widget from './layouts/Widget';
import TranslationsContext from './context/TranslationsContext';
import store from './store/store';
import { createApi, getJwtToken } from './services/api';
import defaultTranslations from './translations/default-translations.json';
import MainTheme from './assets/jss/MainTheme';


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
  return getJwtToken(apiUrl, apiKey, customerId);
};

const checkContainerId = (options) => {
  const { containerId } = options;
  if (!containerId) {
    throw new Error('Please provide container id.');
  }
};


const convertAnswer = (params) => (resp) => {
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
 * @param tokenProvider
 */
export const init = (options, tokenProvider) => {
  checkContainerId(options);
  tokenProvider().then((result) => {
    const {
      responseCode, errorMessage, token, exists,
    } = result;
    const api = createApi(options.apiUrl, token);
    const config = {
      ...options, exists, api, translations: defaultTranslations, errorMessage,
    };
    if (responseCode !== 200 || exists) {
      renderMainComponent(config);
      return;
    }
    Promise.all([
      api.getInfo().then(convertAnswer({ field: 'showOnfidoLogo' })),
      api.getTranslations(config.dictionary).then(convertAnswer({ default: defaultTranslations })),
      api.getPermissions().then(convertAnswer({ field: 'sdkPermissions' })),
    ]).then(([showOnfidoLogo, translations, sdkPermissions]) => {
      renderMainComponent({
        ...config, translations, showOnfidoLogo, sdkPermissions,
      });
    });
  });
};
