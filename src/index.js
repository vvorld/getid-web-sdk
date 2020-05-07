import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/toBlob.polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import Main from './layouts/Main';
import TranslationsContext from './context/TranslationsContext';
import store from './store/store';
import { createApi } from './services/api';
import defaultTranslations from './translations/default.json';
import MainTheme from './theme';
import { createPublicTokenProvider } from './helpers/token-provider';

const supportedBrowsers = require('../supportedBrowsers');

if (!supportedBrowsers.test(navigator.userAgent)) {
  console.error('Your browser is not supported.');
}

const MainModule = (widgetOptions) => (
  <ThemeProvider theme={MainTheme}>
    <Provider store={store}>
      <TranslationsContext.Provider value={{ translations: widgetOptions.translations }}>
        <Main
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

const checkContainerId = (options) => {
  const { containerId } = options;
  if (!containerId) {
    throw new Error('Please provide container id.');
  }
};

const convertAnswer = (params = {}) => (resp) => {
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

const addDefaultValues = () => (resp) => {
  const defaultValues = {
    sdkPermissions: {
      videoRecording: false,
      maxVideoDuration: 3,
      liveness: false,
    },
    showOnfidoLogo: false,
    tokenIsValid: false,
    tokenExpiresIn: 3600,
  };

  return {
    ...resp,
    ...defaultValues,
    sdkPermissions: {
      ...defaultValues.sdkPermissions,
      ...resp.sdkPermissions,
    },
  };
};

const sanitizeConfig = (options) => {
  const { fields } = options;
  return Object.values(
    fields.reduce((list, item) => {
      const name = item.name.toLowerCase();
      // eslint-disable-next-line no-param-reassign
      list[name] = list[name] || item;
      return list;
    }, {}),
  );
};

/**
 * Init. Checks for token => returns the widget.
 * @param options
 * @param tokenProvider
 */
const init = (options, tokenProvider) => {
  checkContainerId(options);
  const getToken = (typeof tokenProvider === 'object')
    ? () => new Promise(((resolve) => resolve(tokenProvider)))
    : tokenProvider;

  const tokenProviderError = 'token provider must be a function that returns promise or jwt response object';

  if (typeof getToken !== 'function') {
    throw new Error(tokenProviderError);
  }

  const tokenPromise = getToken();

  if (typeof tokenPromise.then !== 'function') {
    throw new Error(tokenProviderError);
  }

  tokenPromise.then((result) => {
    const {
      responseCode, errorMessage, token, exists,
    } = result;
    const api = createApi(options.apiUrl, token, options.verificationTypes);
    const config = {
      ...options, exists, api, translations: defaultTranslations, errorMessage,
    };

    if (config.documentData) {
      config.documentData = config.documentData
        .map((el) => (el.value ? { ...el, value: el.value.toLowerCase() } : el));
    }

    if (responseCode !== 200 || exists) {
      renderMainComponent(config);
      return;
    }
    Promise.all([
      sanitizeConfig(config),
      api.getInfo().then(convertAnswer()).then(addDefaultValues()),
      api.getTranslations(config.dictionary).then(convertAnswer({ field: 'translations', default: {} })),
    ]).then(([filteredFields, info, responseTranslations]) => {
      const { showOnfidoLogo, sdkPermissions } = info;
      const translations = { ...defaultTranslations, ...responseTranslations };
      config.fields = filteredFields;
      renderMainComponent({
        ...config, translations, showOnfidoLogo, sdkPermissions,
      });
    });
  });
};

export { createPublicTokenProvider, init };
