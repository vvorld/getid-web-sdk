import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import CustomLogo from '../components/Logo/CustomLogo';
import headerStyles from '../assets/jss/views/UpperPart';
import TranslationsContext from '../context/TranslationsContext';

function UpperPart(props) {
  const { currentStep, flow, currentComponent } = props;

  const { translations } = useContext(TranslationsContext);

  const isLast = () => currentComponent.next === null;

  const isThankYou = () => currentComponent.name === 'ThankYou' && currentComponent.name;
  const header = translations[`${currentComponent.name}_header`];
  const subHeader = translations[`${currentComponent.name}_subHeader`];
  const classes = headerStyles();

  return (
    <Grid container alignItems="center" justify="center" data-role="header" spacing={3}>
      {flow.length > 1 && (
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
        <Grid item xs={12} md={2} className={classes.item}>
          <CustomLogo condition="getIdLogo" />
        </Grid>
        <Grid container alignItems="flex-end" item xs={12} md={8}>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <ProgressBar
              isLast={isLast}
              flowLength={flow.length}
              activeStepParent={currentStep}
            />
          </Grid>
        </Grid>
      </Grid>
      )}
      <Grid className={classes.topPart} container alignItems="center" justify="center">
        <Grid item xs={10} sm={8} md={4}>
          <CustomLogo condition={isThankYou()} />
          { header && (
          <h3
            data-role="componentTitle"
            className={classes.header}
          >
            { header }
          </h3>
          )}
          <hr className={classes.hr} />
          { subHeader && (
          <h5 className={classes.subHeader}>
            { subHeader }
          </h5>
          ) }
        </Grid>
      </Grid>
    </Grid>
  );
}

UpperPart.propTypes = {
  currentStep: PropTypes.number.isRequired,
  flow: PropTypes.array.isRequired,
  currentComponent: PropTypes.object.isRequired,
};

export default UpperPart;
