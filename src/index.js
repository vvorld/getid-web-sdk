import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/toBlob.polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { createApi, getTranslations, getApiVersions } from './services/api';
import defaultTranslations from './translations/default';
import { createPublicTokenProvider } from './helpers/token-provider';
import Widget from './layouts/widget';
import Container from './components/container';
import sortCountryDocuments from './helpers/sort-documents';
import { BrowserNotSupportedErrorView, ErrorView } from './components/errors';
import { cameraAchievable, cameraExist } from './helpers/camera-test';
import { checkApiVersionSupport } from './helpers/generic';

export const renderGetID = (widgetOptions, translations, content) => {
  const container = document.getElementById(widgetOptions.containerId);
  if (container) {
    if (container.hasChildNodes()) {
      ReactDOM.unmountComponentAtNode(container);
    }

    ReactDOM.render(
      <Container {...widgetOptions} translations={translations}>
        {content}
      </Container>, container,
    );
  } else {
    console.error(`container #${widgetOptions.containerId} not found`);
  }
};

const getToken = async (tokenProvider) => {
  if (typeof tokenProvider === 'object' && tokenProvider.token && tokenProvider.responseCode) {
    return tokenProvider;
  }
  if (typeof tokenProvider !== 'function') {
    return null;
  }
  const tokenPromise = tokenProvider();
  if (typeof tokenPromise.then !== 'function') {
    return null;
  }
  return tokenPromise;
};

/**
 * @param originOptions - sdk config object
 * @param tokenProvider - object with token or function, depends on usage
 */
const init = async (originOptions, tokenProvider) => {
  const options = { ...originOptions };

  const renderError = (code, translations = defaultTranslations, Error = ErrorView) => {
    const failCallback = options.onFail && typeof options.onFail === 'function'
      ? () => options.onFail({ code, message: translations[`${code}_error`] || 'internal error' })
      : null;
    renderGetID(options, translations, <Error error={code} failCallback={failCallback} />);
  };

  if (!options.containerId || !document.getElementById(options.containerId)) {
    renderError('container_missmatch');
    return;
  }
  const { verificationTypes, apiUrl } = options;
  try {
    const [tokenResult, responseTranslations] = await Promise.all([
      getToken(tokenProvider),
      getTranslations(apiUrl, options.dictionary),
    ]);
    const customTranslations = options.translations || {};
    const translations = { ...defaultTranslations, ...responseTranslations, ...customTranslations };

    if (tokenResult == null) {
      renderError('token_missmatch', translations);
      return;
    }
    const {
      token, responseCode, statusCode,
    } = tokenResult;
    if (responseCode !== 200 && statusCode) {
      renderError(statusCode, translations);
      return;
    }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (window.location.protocol !== 'https:' && !isLocalhost) {
      renderError('schema_missmatch', translations);
      return;
    }

    if (!cameraAchievable(options)) {
      renderError('browser_not_supported', translations, BrowserNotSupportedErrorView);
      return;
    }
    if (!cameraExist(options)) {
      renderError('no_camera', translations);
      return;
    }

    const api = createApi(apiUrl, token, options.metadata, verificationTypes);

    const [info, countryDocuments, isSupportedApiVersion, verifyTokenResponse] = await Promise.all([
      api.getInfo(),
      api.getCountryAndDocList()
        .then(({ countries }) => sortCountryDocuments(countries, options.onSortDocuments)),
      getApiVersions(apiUrl)
        .then(checkApiVersionSupport).catch((error) => {
          console.log(`Can't get supported api versions ${error}`);
          return true;
        }),
      api.verifyToken(),
    ]);
    if (!isSupportedApiVersion) {
      renderError('api_version_missmatch', translations);
      return;
    }
    if (verifyTokenResponse.responseCode !== 200 && verifyTokenResponse.statusCode) {
      renderError(verifyTokenResponse.statusCode, translations);
      return;
    }
    if (verifyTokenResponse.responseCode !== 200) {
      throw verifyTokenResponse;
    }

    renderGetID(options, translations, <Widget
      {...options}
      {...info}
      countryDocuments={countryDocuments}
      api={api}
    />);
  } catch (e) {
    console.error(e);
    const messageMapping = {
      'jwt malformed': 'token_malformed',
      'invalid token': 'jwt_invalid',
      'No JWT has been provided': 'token_empty',
      'jwt expired': 'token_expired',
      'Application exists': 'app_exists',
    };

    renderError(messageMapping[e.message] || 'internal');
  }
};

export { createPublicTokenProvider, init };
