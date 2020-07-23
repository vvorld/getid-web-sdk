import React, { useContext } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import ErrorViewStyles from './style';
import ButtonStyles from '../../../components/buttons/style';
import TranslationsContext from '../../../context/TranslationsContext';

import CustomLogo from '../../../components/logo/custom-logo';

const createErrorView = (config) => (props) => {
  const {
    callbacks, responseCode, submitAttempts, error,
  } = props;

  const buttonStyle = ButtonStyles();
  const { translations: dictionary } = useContext(TranslationsContext);

  const {
    hrLong, hr, center, marginAuto, centerBlock, item,
  } = ErrorViewStyles();

  const { buttons } = config;
  if (submitAttempts < 0) { delete buttons.retry; }

  return (
    <Grid container className={centerBlock} justify="center" alignItems="center">
      <Grid item xs={12} sm={9} md={7} lg={6} className={item}>
        <CustomLogo condition="Reset" />
        <Typography variant="h1">
          {config.header(dictionary, responseCode, error)}
        </Typography>
        <hr className={hr} />
        <Typography variant="h2">
          {config.subHeader(dictionary, responseCode, error)}
        </Typography>
        <hr className={hrLong} />
        {buttons && (
          <div className={center}>
            {Object.entries(buttons).map(([key, button]) => (
              <Grid className={marginAuto} key={`button-${key}`} item xs={9} sm={12 / Object.keys(buttons).length}>
                <Button
                  classes={{ root: buttonStyle.root }}
                  variant={button.variant}
                  className={buttonStyle[button.class]}
                  onClick={() => button.action(callbacks)(error)}
                >
                  {button.name(dictionary)}
                </Button>
              </Grid>
            ))}
          </div>
        )}
      </Grid>
    </Grid>
  );
};

const errorProps = {
  condition: PropTypes.string,
  error: PropTypes.string,
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
  header: (dictionary, responseCode, errorMessage) => dictionary[`${errorMessage}_header`] || dictionary.error_header,
  subHeader: (dictionary, responseCode, errorMessage) => dictionary[`${errorMessage}_subHeader`] || dictionary.error_subHeader,
  buttons: {
    done: {
      name: (dictionary) => dictionary.done_onfail_button,
      action: (callbacks) => callbacks.onFail,
      variant: 'contained',
    },
  },
});

export const CameraErrorView = createErrorView({
  header: (dictionary) => dictionary.camera_error_header,
  subHeader: (dictionary) => dictionary.camera_error_subHeader,
});

export const ApiVersionErrorView = createErrorView({
  header: (dictionary) => dictionary.api_version_error_header,
  subHeader: (dictionary) => dictionary.api_version_error_subHeader,
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
