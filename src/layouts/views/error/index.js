import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ErrorViewStyles from './style';
import ButtonStyles from '../../../components/buttons/style';
import TranslationsContext from '../../../context/TranslationsContext';

import CustomLogo from '../../../components/logo/custom-logo';

const createErrorView = (config) => (props) => {
  const {
    classes, callbacks, responseCode, submitAttempts,
  } = props;

  const buttonStyle = ButtonStyles();
  const { translations: dictionary } = useContext(TranslationsContext);

  const {
    hrLong, hr, subHeader, center, header, marginAuto,
  } = ErrorViewStyles();

  const { buttons } = config;
  if (submitAttempts < 0) { delete buttons.retry; }
  const { length } = Object.keys(buttons);
  return (
    <Grid container className={classes.center} justify="center" alignItems="center">
      <Grid item xs={12} sm={9} md={7} lg={6} className={classes.item}>
        <CustomLogo condition="Reset" />
        <h3 className={header}>
          {config.header(dictionary, responseCode)}
        </h3>
        <hr className={hr} />
        <h5 className={subHeader}>
          {config.subHeader(dictionary, responseCode)}
        </h5>
        <hr className={hrLong} />
        <div className={center}>
          {Object.entries(buttons).map(([key, button]) => (
            <Grid className={marginAuto} key={`button-${key}`} item xs={9} sm={12 / length}>
              <Button
                classes={{ root: buttonStyle.root }}
                className={buttonStyle[button.class]}
                onClick={button.action(callbacks)}
              >
                {button.name(dictionary)}
              </Button>
            </Grid>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

const errorProps = {
  classes: PropTypes.object.isRequired,
  condition: PropTypes.string.isRequired,
  callbacks: PropTypes.object.isRequired,
};

export const AppExistsView = createErrorView({
  header: (dictionary) => dictionary.exists_header,
  subHeader: (dictionary) => dictionary.exists_subHeader,
  buttons: {
    done: {
      name: (dictionary) => dictionary.done_button,
      action: (callbacks) => callbacks.onExists,
      class: 'isGradient',
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
      class: 'isGradient',
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
      class: 'prevButton',
    },
    retry: {
      name: (dictionary) => dictionary.retry_button,
      action: (callbacks) => callbacks.onSubmit,
      class: 'isGradient',
    },
  },
});

FailError.props = errorProps;
AppExistsView.props = errorProps;
ErrorView.props = errorProps;
