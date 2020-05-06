import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import { Grid } from '@material-ui/core';
import stepperStyles from '../../assets/jss/components/progressBar/Stepper';
import customisedStepIcon from './StepIcon';

const useStyles = makeStyles(() => ({
  stepper: {
    padding: '15px 0',
  },
}));

function ProgressBar(props) {
  const { flowLength, activeStepParent } = props;

  const classes = useStyles();
  const CustomisedConnector = withStyles(stepperStyles)(StepConnector);

  return (
    <Grid container alignItems="flex-end" item xs={12} md={8}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={9} md={6}>
          <Stepper
            alternativeLabel
            activeStep={activeStepParent}
            connector={<CustomisedConnector />}
            className={classes.stepper}
          >
            {[...Array(flowLength)].map((i) => (
              <Step key={`step-${i}`}>
                <StepLabel
                  StepIconProps={{ last: flowLength }}
                  StepIconComponent={customisedStepIcon}
                />
              </Step>
            ))}
          </Stepper>
        </Grid>
      </Grid>
    </Grid>
  );
}

ProgressBar.propTypes = {
  flowLength: PropTypes.number.isRequired,
  activeStepParent: PropTypes.number.isRequired,
};

export default ProgressBar;
