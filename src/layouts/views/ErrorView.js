import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ResetStyles from '../../assets/jss/views/ResetView';
import ButtonStyles from '../../assets/jss/components/buttons/Button';
import TranslationsContext from '../../context/TranslationsContext';

import CustomLogo from '../../components/Logo/CustomLogo';

const createErrorView = (config) => (props) => {
  const { classes, callbacks } = props;

  const buttonStyle = ButtonStyles();
  const { translations: tran } = useContext(TranslationsContext);

  const {
    hrLong, hr, subHeader, center, header, marginAuto,
  } = ResetStyles();

  const { buttons } = config;
  const { length } = Object.keys(buttons);
  return (
    <Grid container className={classes.center} justify="center" alignItems="center">
      <Grid item xs={12} sm={9} md={7} lg={6} className={classes.item}>
        <CustomLogo condition="Reset" />
        <h3 className={header}>
          {config.header(tran)}
        </h3>
        <hr className={hr} />
        <h5 className={subHeader}>
          {config.subHeader(tran)}
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
                {button.name(tran)}
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

export const ExistAppError = createErrorView({
  header: (tran) => tran.exists_header,
  subHeader: (tran) => tran.exists_subHeader,
  buttons: {
    done: {
      name: (tran) => tran.done_button,
      action: (callbacks) => callbacks.onExists,
      class: 'isGradient',
    },
  },
});

export const FailError = createErrorView({
  header: (tran) => tran.isFail_header,
  subHeader: (tran) => tran.isFail_subHeader,
  buttons: {
    cancel: {
      name: (tran) => tran.cancel_button,
      action: (callbacks) => callbacks.onFail,
      class: 'prevButton',
    },
    retry: {
      name: (tran) => tran.retry_button,
      action: (callbacks) => callbacks.onSubmit,
      class: 'isGradient',
    },
    chooseFlow: {
      name: (tran) => tran.choose_flow_button,
      action: (callbacks) => callbacks.onFail,
      class: 'prevButton',
    },
  },
});

FailError.props = errorProps;
ExistAppError.props = errorProps;
