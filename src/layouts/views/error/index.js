import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../../context/TranslationsContext';

const createErrorView = (config) => (props) => {
  const {
    callbacks, responseCode, submitAttempts,
  } = props;

  const { translations: dictionary } = useContext(TranslationsContext);

  const { buttons } = config;
  if (submitAttempts < 0) { delete buttons.retry; }

  return (
    <div>
      <h1>
        {config.header(dictionary, responseCode)}
      </h1>
      <h2>
        {config.subHeader(dictionary, responseCode)}
      </h2>
      <hr />
      {buttons && (
        <div>
          {Object.entries(buttons).map(([key, button]) => (
            <div>
              <button onClick={button.action(callbacks)}>
                {button.name(dictionary)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
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
      variant: 'contained',
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
      variant: 'contained',
    },
  },
});

export const CameraErrorView = createErrorView({
  header: (dictionary) => dictionary.camera_error_header,
  subHeader: (dictionary) => dictionary.camera_error_subHeader,
});

export const FailError = createErrorView({
  header: (dictionary, responseCode) => dictionary[`${responseCode}_header`] || dictionary.isFail_header,
  subHeader: (dictionary, responseCode) => dictionary[`${responseCode}_subHeader`] || dictionary.isFail_subHeader,
  buttons: {
    cancel: {
      name: (dictionary) => dictionary.cancel_button,
      action: (callbacks) => callbacks.onFail,
      variant: 'outlined',
    },
    retry: {
      name: (dictionary) => dictionary.retry_button,
      action: (callbacks) => callbacks.onSubmit,
      variant: 'contained',
    },
  },
});

FailError.props = errorProps;
AppExistsView.props = errorProps;
ErrorView.props = errorProps;
CameraErrorView.props = errorProps;
