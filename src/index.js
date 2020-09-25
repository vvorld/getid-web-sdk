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
  BrowserNotSupportedErrorView,
  ErrorView,
} from './components/errors';

import {
  convertAnswer,
  checkApiVersionSupport,
  sortCountryDocuments,
} from './helpers/generic';
import cameraViews from './constants/camera-views';

const defaultSortDocuments = (country, documents) => {
  const idPassportDrivingCountries = ['at', 'be', 'bg', 'de', 'ee', 'fi', 'fr', 'gb', 'gr', 'hu', 'ie', 'is', 'it', 'lv', 'mt', 'no', 'pt', 'ro', 'se', 'si', 'cn'];
  const passportIdDrivingCountries = ['cy', 'li', 'lt', 'nl'];
  const idDrivingPassportCountries = ['cz', 'dk', 'es', 'hr', 'pl', 'sk'];
  const drivingPassportIdCountries = ['lu'];
  const drivingIdPassportCountries = ['au'];

  const idPassportDrivingDocuments = ['id-card', 'passport', 'driving-licence', 'residence-permit'];
  const passportIdDrivingDocuments = ['passport', 'id-card', 'driving-licence', 'residence-permit'];
  const idDrivingPassportDocuments = ['id-card', 'driving-licence', 'passport', 'residence-permit'];
  const drivingPassportIdDocuments = ['driving-licence', 'passport', 'id-card', 'residence-permit'];
  const drivingIdPassportDocuments = ['driving-licence', 'id-card', 'passport', 'residence-permit'];

  if (drivingPassportIdCountries.includes(country)) return drivingPassportIdDocuments;
  if (drivingIdPassportCountries.includes(country)) return drivingIdPassportDocuments;
  if (passportIdDrivingCountries.includes(country)) return passportIdDrivingDocuments;
  if (idDrivingPassportCountries.includes(country)) return idDrivingPassportDocuments;
  if (idPassportDrivingCountries.includes(country)) return idPassportDrivingDocuments;

  return documents;
};

const cameraAchievable = (options) => {
  const isCameraComponent = options.flow.some((view) => cameraViews.includes(view.component));
  if (!isCameraComponent) {
    return true;
  }
  const isIOSChrome = navigator.userAgent.match('CriOS');
  return ((navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) && !isIOSChrome);
};

const cameraExist = async () => {
  const divices = await navigator.mediaDevices.enumerateDevices();
  return !!(divices && divices.find((x) => x.kind === 'videoinput'));
};

/**
 * @param originOptions - sdk config object
 * @param tokenProvider - object with token or function, depends on usage
 */
const init = (originOptions, tokenProvider) => {
  const options = { ...originOptions };

  const renderError = (code, translations = defaultTranslations, Error = ErrorView) => {
    if (options.onFail && typeof options.onFail === 'function') {
      options.onFail({
        code,
        message: translations[`${code}_error`] || 'internal error',
      });
    }
    renderComponent({
      ...options,
      translations,
    }, <Error error={code} />);
  };

  if (!options.containerId || !document.getElementById(options.containerId)) {
    renderError('container_missmatch');
    return;
  }

  const getToken = (typeof tokenProvider === 'object')
    ? () => new Promise(((resolve) => resolve(tokenProvider)))
    : tokenProvider;

  if (typeof getToken !== 'function') {
    renderError('token_missmatch');
    return;
  }

  const tokenPromise = getToken();

  if (typeof tokenPromise.then !== 'function') {
    renderError('token_missmatch');
    return;
  }

  tokenPromise.then(async (result) => {
    const {
      token, exists, errorMessage, responseCode,
    } = result;

    const { verificationTypes, apiUrl } = options;
    const api = createApi(apiUrl, token, options.metadata, verificationTypes);
    const responseTranslations = await api.getTranslations(options.dictionary).then(convertAnswer({ field: 'translations', default: {} }));
    const customTranslations = options.translations || {};
    const translations = { ...defaultTranslations, ...responseTranslations, ...customTranslations };

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

    if (responseCode !== 200 && errorMessage) {
      renderError(errorMessage, translations);
      return;
    }

    if (responseCode !== 200 || exists) {
      renderError('app_exists', translations);
      return;
    }

    if (options.documentData) {
      options.documentData = options.documentData.map((el) => (el.value ? {
        ...el,
        value: el.value.toLowerCase(),
      } : el));
    }
    const { onSortDocuments = defaultSortDocuments } = options;
    Promise.all([
      api.getInfo().then(convertAnswer()),
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
        renderError('api_version_missmatch', translations);
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
  }).catch((e) => {
    console.error(e);
    renderError('internal_error');
  });
};

export { createPublicTokenProvider, init };
