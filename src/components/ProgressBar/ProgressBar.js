import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';
import customisedStepIcon from './StepIcon';
import CustomisedConnector from './Connector';

const useStyles = makeStyles(() => ({
  stepper: {
    padding: '15px 0',
  },
}));

function ProgressBar(props) {
  const { flowLength, activeStepParent } = props;
  const classes = useStyles();

  return (
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
  );
}

ProgressBar.propTypes = {
  flowLength: PropTypes.number.isRequired,
  activeStepParent: PropTypes.number.isRequired,
};

export default ProgressBar;
