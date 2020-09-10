import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '~/context/TranslationsContext';
import ErrorIcon from '~/assets/icons/views/error-icon.svg';
import PoweredBy from '~/components/blocks/powered-by';
import Browsers from './browsers';

const createErrorView = (config) => (props) => {
  const {
    callbacks, error, submitAttempts,
  } = props;

  const { translations: dictionary } = useContext(TranslationsContext);

  const { buttons } = config;
  if (submitAttempts < 0) { delete buttons.retry; }

  return (
    <main id="getid-main" data-role="container">
      <div className="getid-grid__main">
        <div><img alt="error" src={ErrorIcon} /></div>
        <div style={{ margin: '50px auto' }} className="getid-header__container">
          <div className="getid-header__big">
            {config.header(dictionary, error)}
          </div>
          <div className="getid-header__small">
            {config.subHeader(dictionary, error)}
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
        {config.children && config.children(dictionary)}
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

export const ApiVersionErrorView = createErrorView({
  header: (dictionary) => dictionary.apiVersion_error_header,
  subHeader: (dictionary) => dictionary.apiVersion_error_subHeader,
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
  children: (dictionary) => <Browsers dictionary={dictionary} />,
});

export const HttpErrorView = createErrorView({
  header: (dictionary) => dictionary.http_error_header,
  subHeader: (dictionary) => dictionary.http_error_subHeader,
});

export const FailError = createErrorView({
  header: (dictionary, error) => dictionary[`${error}_header`] || dictionary.isFail_header,
  subHeader: (dictionary, error) => dictionary[`${error}_subHeader`] || dictionary.isFail_subHeader,
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

const getErrorText = (dictionary, name) => {
  if (name === 'NotAllowedError') {
    return dictionary.camera_error_not_allowed;
  }
  if (name === 'NotFoundError') {
    return dictionary.camera_error_not_found;
  }
  return dictionary.camera_error_generic;
};
export const CameraDisabledErrorView = createErrorView({
  header: (dictionary) => dictionary.camera_error_header,
  subHeader: getErrorText,
  buttons: {
    retry: {
      name: (dictionary) => dictionary.retry_button,
      action: (callbacks) => callbacks.onRetry,
      className: 'violet',
    },
  },
});

FailError.props = errorProps;
AppExistsView.props = errorProps;
ErrorView.props = errorProps;
CameraErrorView.props = errorProps;
CameraDisabledErrorView.props = errorProps;
