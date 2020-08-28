import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '~/context/TranslationsContext';
import ErrorIcon from '~/assets/icons/views/error-icon.svg';
import PoweredBy from '~/components/blocks/powered-by';
import Browsers from './browsers';

import '../style.css';

const createErrorView = (config) => (props) => {
  const {
    callbacks, responseCode, submitAttempts,
  } = props;

  const { translations: dictionary } = useContext(TranslationsContext);

  const { buttons, extra } = config;
  if (submitAttempts < 0) { delete buttons.retry; }

  return (
    <main id="getid-main" data-role="container">
      <div className="getid-grid__main">
        <div><img alt="error" src={ErrorIcon} /></div>
        <div style={{ margin: '50px auto' }} className="getid-header__container">
          <div className="getid-header__big">
            {config.header(dictionary, responseCode)}
          </div>
          <div className="getid-header__small">
            {config.subHeader(dictionary, responseCode)}
          </div>
        </div>
        {buttons && (
          <div>
            {Object.entries(buttons).map(([key, button]) => (
              <div key={key}>
                <button className={`getid-button__main getid-${button.className}`} type="button" onClick={button.action(callbacks)}>
                  {button.name(dictionary)}
                </button>
              </div>
            ))}
          </div>
        )}
        {extra && <Browsers config={extra} dictionary={dictionary} />}
        {buttons && (
          <footer className="getid-footer">
            <PoweredBy />
          </footer>
        )}
      </div>
    </main>
  );
};

const errorProps = {
  condition: PropTypes.string,
  submitAttempts: PropTypes.number,
  callbacks: PropTypes.object,
};

export const AppExistsView = createErrorView({
  header: (dictionary) => dictionary.exists_header,
  subHeader: (dictionary) => dictionary.exists_subHeader,
  buttons: {
    done: {
      name: (dictionary) => dictionary.done_button,
      action: (callbacks) => callbacks.onExists,
      className: 'violet',
    },
  },
});

export const ErrorView = createErrorView({
  header: (dictionary) => dictionary.error_header,
  subHeader: (dictionary) => dictionary.error_subHeader,
  buttons: {
    done: {
      name: (dictionary) => dictionary.done_button,
      action: (callbacks) => callbacks.onFail,
      className: 'violet',
    },
  },
});

export const CameraErrorView = createErrorView({
  header: (dictionary) => dictionary.camera_error_header,
  subHeader: (dictionary) => dictionary.camera_error_subHeader,
  extra: {
    text: (dictionary) => dictionary.camera_error_another_browser,
    buttons: {
      safari: {
        name: 'Safari',
        link: 'https://support.apple.com/downloads/safari',
      },
      chrome: {
        name: 'Chrome',
        link: 'https://www.google.com/chrome/',
      },
      firefox: {
        name: 'Firefox',
        link: 'https://www.mozilla.org/en-US/firefox/new/',
      },
    },
  },
});

export const FailError = createErrorView({
  header: (dictionary, responseCode) => dictionary[`${responseCode}_header`] || dictionary.isFail_header,
  subHeader: (dictionary, responseCode) => dictionary[`${responseCode}_subHeader`] || dictionary.isFail_subHeader,
  buttons: {
    cancel: {
      name: (dictionary) => dictionary.cancel_button,
      action: (callbacks) => callbacks.onFail,
      className: 'grey',
    },
    retry: {
      name: (dictionary) => dictionary.retry_button,
      action: (callbacks) => callbacks.onSubmit,
      className: 'violet',
    },
  },
});

FailError.props = errorProps;
AppExistsView.props = errorProps;
ErrorView.props = errorProps;
CameraErrorView.props = errorProps;
