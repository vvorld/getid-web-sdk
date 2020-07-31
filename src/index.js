import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/toBlob.polyfill';

import { renderMainComponent } from './main-module';
import React from 'react';
import { createApi } from './services/api';
import defaultTranslations from './translations/default.json';
import { createPublicTokenProvider } from './helpers/token-provider';

import {
  convertAnswer,
  addDefaultValues,
} from './helpers/generic';
import cameraViews from './constants/camera-views';

const supportedBrowsers = require('../supportedBrowsers');

if (!supportedBrowsers.test(navigator.userAgent)) {
  console.log('Your browser is not supported.');
}

const cameraNotAchievable = (options) => {
  const enableCamera = options.flow.some((view) => cameraViews.includes(view.component));
  const isIOSChrome = navigator.userAgent.match('CriOS');
  if (!enableCamera) {
    return true;
  }
  return ((!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) && !isIOSChrome);
};

/**
 * @param options - sdk config object
 * @param tokenProvider - object with token or function, depends on usage
 */
const init = (options, tokenProvider) => {
  if (!options.containerId) {
    throw new Error('Please provide container id.');
  }

  if (cameraNotAchievable(options)) {
    if (options.onFail && typeof options.onFail === 'function') {
      const error = new Error('mediaDevices_no_supported');
      options.onFail(error);
      return;
    }
    // TODO
    renderComponent(<CameraErrorView />);
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
    const {
      responseCode, errorMessage, token, exists,
    } = result;
    if (responseCode !== 200 && errorMessage) {
      // TODO  переводы!
      // TODO catch ошибок
      renderComponent(<ErrorView callbacks={{ onFail }} />);
    }

    if (responseCode !== 200 || exists) {
      // TODO
      renderComponent(<AppExistsView callbacks={{ onExists }} />);
      return;
    }
    const { metadata, verificationTypes, apiUrl } = options;
    if (options.documentData) {
      options.documentData = options.documentData
        .map((el) => (el.value ? {
          ...el,
          value: el.value
            .toLowerCase(),
        } : el));
    }
    const api = createApi(apiUrl, token, verificationTypes, metadata);
    Promise.all([
      api.getInfo().then(convertAnswer()).then(addDefaultValues()),
      api.getTranslations(options.dictionary).then(convertAnswer({ field: 'translations', default: {} })),
      api.getCountryAndDocList().then(convertAnswer({ field: 'countries' })),
    ]).then(([info, responseTranslations, countryDocuments]) => {
      renderMainComponent({
        ...info,
        ...options,
        translations: { ...defaultTranslations, ...responseTranslations },
        countryDocuments,
        api,
      });
    });
  });
};

export { createPublicTokenProvider, init };
