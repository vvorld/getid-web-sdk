import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/toBlob.polyfill';

import React from 'react';
import { renderMainComponent, renderComponent } from './main-module';
import { createApi, getApiVersions } from './services/api';
import defaultTranslations from './translations/default';
import { createPublicTokenProvider } from './helpers/token-provider';

import {
  CameraErrorView, ErrorView, AppExistsView, HttpErrorView,
  ApiVersionErrorView,
} from './components/errors';

import {
  convertAnswer,
  addDefaultValues,
  setCss,
  checkApiVersionSupport,
  sortCountryDocuments,
} from './helpers/generic';
import cameraViews from './constants/camera-views';

const cameraAchievable = (options) => {
  const isCameraComponent = options.flow.some((view) => cameraViews.includes(view.component));
  const isIOSChrome = navigator.userAgent.match('CriOS');
  if (!isCameraComponent) {
    return true;
  }
  return ((navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) && !isIOSChrome);
};

/**
 * @param originOptions - sdk config object
 * @param tokenProvider - object with token or function, depends on usage
 */
const init = (originOptions, tokenProvider) => {
  const options = { ...originOptions };
  if (!options.containerId) {
    throw new Error('Please provide container id.');
  }

  if (options.styles) {
    setCss(options.styles);
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

  tokenPromise.then(async (result) => {
    const {
      token, exists, errorMessage, responseCode,
    } = result;

    const { verificationTypes, apiUrl } = options;
    if (verificationTypes) {
      if (!options.metadata) {
        options.metadata = {};
      }
      options.metadata.verificationTypes = verificationTypes;
    }
    const api = createApi(apiUrl, token, options.metadata);
    const responseTranslations = await api.getTranslations(options.dictionary).then(convertAnswer({ field: 'translations', default: {} }));
    const customTranslations = options.translations || {};
    const translations = { ...defaultTranslations, ...responseTranslations, ...customTranslations };

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (window.location.protocol !== 'https:' && !isLocalhost) {
      renderComponent({
        ...options,
        translations,
      },
        <HttpErrorView />);
      return;
    }

    if (!cameraAchievable(options)) {
      if (options.onFail && typeof options.onFail === 'function') {
        const error = new Error('mediaDevices_no_supported');
        options.onFail(error);
        return;
      }
      renderComponent({
        ...options,
        translations,
      },
        <CameraErrorView />);
      return;
    }

    if (responseCode !== 200 && errorMessage) {
      renderComponent({
        ...options,
        translations,
      },
        <ErrorView callbacks={{ onFail: options.onFail }} />);
      return;
    }

    if (responseCode !== 200 || exists) {
      renderComponent({
        ...options,
        translations,
      },
        <AppExistsView callbacks={{ onExists: options.onExists }} />);
      return;
    }

    if (options.documentData) {
      options.documentData = options.documentData
        .map((el) => (el.value ? {
          ...el,
          value: el.value
            .toLowerCase(),
        } : el));
    }
    const { onSortDocuments } = options;
    Promise.all([
      api.getInfo().then(convertAnswer()).then(addDefaultValues()),
      api.getCountryAndDocList().then(convertAnswer())
        .then(({ countries }) => (onSortDocuments && typeof onSortDocuments === 'function'
          ? sortCountryDocuments(countries, onSortDocuments)
          : countries)),
      getApiVersions(apiUrl).then(checkApiVersionSupport).catch((error) => {
        console.log(`Can't get supported api versions ${error}`);
        return true;
      }),

    ]).then(([info, countryDocuments, isSupportedApiVersion]) => {
      if (!isSupportedApiVersion) {
        renderComponent({
          ...options,
          translations,
        },
          <ApiVersionErrorView callbacks={{ onExists: options.onExists }} />);
        return;
      }
      renderMainComponent({
        ...info,
        ...options,
        countryDocuments,
        translations,
        api,
      });
    });
  });
};

export { createPublicTokenProvider, init };
