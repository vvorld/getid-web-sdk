import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ResetStyles from '../../assets/jss/views/ResetView';
import ButtonStyles from '../../assets/jss/components/buttons/Button';
import TranslationsContext from '../../context/TranslationsContext';

import CustomLogo from '../../components/Logo/CustomLogo';

const ResetView = (props) => {
  const { config, classes } = props;
  const buttonStyle = ButtonStyles();
  const { translations } = useContext(TranslationsContext);

  const {
    hrLong, hr, subHeader, center, header,
  } = ResetStyles();

  return (
    <Grid container className={classes.root} justify="center" alignItems="center">
      <Grid item xs={12} sm={9} md={7} lg={6} className={classes.item}>
        <CustomLogo condition="Reset" />
        <h3 className={header}>
          {translations.ResetPage_header}
        </h3>
        <hr className={hr} />
        <h5 className={subHeader}>
          {translations.ResetPage_subHeader}
        </h5>
        <hr className={hrLong} />
        <div className={center}>
          {Object.keys(config).map((key) => (
            <Grid key={`button-${key}`} item xs={6} sm={4}>
              <Button
                classes={{
                  root: buttonStyle.root,
                }}
                className={buttonStyle[config[key].class]}
                onClick={config[key].action}
              >
                {config[key].name}
              </Button>
            </Grid>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

ResetView.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

export default ResetView;
