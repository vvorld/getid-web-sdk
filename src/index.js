import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/toBlob.polyfill';
import { renderMainComponent } from './main-module';
import { createApi } from './services/api';
import defaultTranslations from './translations/default.json';
import { createPublicTokenProvider } from './helpers/token-provider';
import {
  sanitizeConfig,
  checkContainerId,
  convertAnswer,
  addDefaultValues,
} from './helpers/generic';

const supportedBrowsers = require('../supportedBrowsers');

if (!supportedBrowsers.test(navigator.userAgent)) {
  console.log('Your browser is not supported.');
}

/**
 * @param options - sdk config object
 * @param tokenProvider - object with token or function, depends on usage
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
    const { metadata, verificationTypes, apiUrl } = options;
    const api = createApi(apiUrl, token, verificationTypes, metadata);

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
