import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ResetStyles from '../../assets/jss/views/ResetView';
import ButtonStyles from '../../assets/jss/components/buttons/Button';
import TranslationsContext from '../../context/TranslationsContext';

import CustomLogo from '../../components/Logo/CustomLogo';

const ResetView = (props) => {
  const { failAction, submitAction, classes } = props;
  const viewStyle = ResetStyles();
  const buttonStyle = ButtonStyles();
  const { translations } = useContext(TranslationsContext);

  const resetFormConfig = () => ({
    cancel: {
      name: translations.cancel_button,
      action: failAction,
      class: 'prevButton',
    },
    retry: {
      name: translations.retry_button,
      action: submitAction,
      class: 'isGradient',
    },
    chooseFlow: {
      name: translations.choose_flow_button,
      action: failAction,
      class: 'prevButton',
    },
  });

  return (
    <Grid container className={classes.root} justify="center" alignItems="center">
      <Grid item xs={12} sm={9} md={7} lg={6} className={classes.item}>
        <CustomLogo condition="Reset" />
        <h3 className={viewStyle.header}>
          {translations.ResetPage_header}
        </h3>
        <hr className={viewStyle.hr} />
        <h5 className={viewStyle.subHeader}>
          {translations.ResetPage_subHeader}
        </h5>
        <hr className={viewStyle.hrLong} />
        <div className={viewStyle.center}>
          {Object.keys(resetFormConfig()).map((key) => (
            <Grid key={`button-${key}`} item xs={6} sm={4}>
              <Button
                classes={{
                  root: buttonStyle.root,
                }}
                className={buttonStyle[resetFormConfig()[key].class]}
                onClick={resetFormConfig()[key].action}
              >
                {resetFormConfig()[key].name}
              </Button>
            </Grid>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

ResetView.propTypes = {
  failAction: PropTypes.func.isRequired,
  submitAction: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default ResetView;
