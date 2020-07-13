import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/toBlob.polyfill';
import { renderMainComponent } from './main-module';
import { createApi, getApiVersions } from './services/api';
import defaultTranslations from './translations/default.json';
import { createPublicTokenProvider } from './helpers/token-provider';
import mapApiErrors from './constants/error-mapping';
import {
  removeFieldDupes,
  checkContainerId,
  convertAnswer,
  addDefaultValues,
  checkApiVersionSupport,
} from './helpers/generic';
import cameraViews from './constants/camera-views';

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
  const found = options.flow
    .some((view) => view.component
      .some((step) => cameraViews.includes(step)));

  if (found) {
    if (!navigator.mediaDevices
      || !navigator.mediaDevices.enumerateDevices
      || !navigator.mediaDevices.getUserMedia) {
      if (options.onFail && typeof options.onFail === 'function') {
        const error = new Error('mediaDevices_no_supported');
        options.onFail(error);
        return;
      }
      const config = {
        ...options, cameraNoSupported: true, translations: defaultTranslations,
      };
      renderMainComponent(config);
      return;
    }
  }

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
    const { errorMessage, token, statusCode } = result;
    const { metadata, verificationTypes, apiUrl } = options;
    const api = createApi(apiUrl, token, verificationTypes, metadata);

    const config = {
      ...options, api, translations: defaultTranslations, errorMessage,
    };

    if (config.documentData) {
      config.documentData = config.documentData
        .map((el) => (el.value ? { ...el, value: el.value.toLowerCase() } : el));
    }

    if (errorMessage || statusCode) {
      renderMainComponent({ ...config, statusCode, errorMessage });
      return;
    }

    Promise.all([
      removeFieldDupes(config.fields),
      api.getInfo().then(convertAnswer()).then(addDefaultValues()),
      api.getTranslations(config.dictionary).then(convertAnswer({ field: 'translations', default: {} })),
      getApiVersions(apiUrl).then(checkApiVersionSupport).catch((error) => {
        console.log(`Can't get supported api versions ${error}`);
        return true;
      }),
      api.verifyToken().then(convertAnswer()),
    ]).then(([filteredFields, info, responseTranslations, isSupportedApiVersion]) => {
      const { showOnfidoLogo, sdkPermissions } = info;
      const customTranslations = options.translations || {};
      const translations = {
        ...defaultTranslations,
        ...responseTranslations,
        ...customTranslations,
      };
      config.fields = filteredFields;
      renderMainComponent({
        ...config, translations, showOnfidoLogo, sdkPermissions, isSupportedApiVersion,
      });
    }).catch((e) => {
      const translations = {
        ...defaultTranslations,
        ...options.translations || {},
      };
      renderMainComponent({
        ...options,
        api,
        statusCode,
        translations,
        errorMessage: mapApiErrors[e.message] || 'token_invalid',
      });
    });
  });
};

export { createPublicTokenProvider, init };
