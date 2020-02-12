import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ResetStyles from '../../assets/jss/views/ResetView';
import ButtonStyles from '../../assets/jss/components/buttons/Button';
import TranslationsContext from '../../context/TranslationsContext';

import CustomLogo from '../../components/Logo/CustomLogo';

const ErrorView = (props) => {
  const {
    classes, condition, callbacks: { onFail, onExists, onSubmit },
  } = props;

  const buttonStyle = ButtonStyles();
  const { translations } = useContext(TranslationsContext);

  const {
    hrLong, hr, subHeader, center, header, marginAuto,
  } = ResetStyles();

  const finalViewConfig = {
    exists: {
      header: translations.exists_header,
      subHeader: translations.exists_subHeader,
      buttons: {
        done: {
          name: translations.done_button,
          action: onExists,
          class: 'isGradient',
        },
      },
    },
    isFail: {
      header: translations.isFail_header,
      subHeader: translations.isFail_subHeader,
      buttons: {
        cancel: {
          name: translations.cancel_button,
          action: onFail,
          class: 'prevButton',
        },
        retry: {
          name: translations.retry_button,
          action: onSubmit,
          class: 'isGradient',
        },
        chooseFlow: {
          name: translations.choose_flow_button,
          action: onFail,
          class: 'prevButton',
        },
      },
    },
  };

  const config = finalViewConfig[condition];
  const { buttons } = config;
  const { length } = Object.keys(buttons);
  return (
    <Grid container className={classes.center} justify="center" alignItems="center">
      <Grid item xs={12} sm={9} md={7} lg={6} className={classes.item}>
        <CustomLogo condition="Reset" />
        <h3 className={header}>
          {config.header}
        </h3>
        <hr className={hr} />
        <h5 className={subHeader}>
          {config.subHeader}
        </h5>
        <hr className={hrLong} />
        <div className={center}>
          {Object.keys(buttons).map((key) => (
            <Grid className={marginAuto} key={`button-${key}`} item xs={9} sm={12 / length}>
              <Button
                classes={{
                  root: buttonStyle.root,
                }}
                className={buttonStyle[buttons[key].class]}
                onClick={buttons[key].action}
              >
                {buttons[key].name}
              </Button>
            </Grid>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

ErrorView.propTypes = {
  classes: PropTypes.object.isRequired,
  condition: PropTypes.string.isRequired,
  callbacks: PropTypes.object.isRequired,
};

export default ErrorView;
