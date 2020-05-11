import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import ProgressBar from '../flow-progression/progress-bar/progress-bar';
import CustomLogo from '../../logo/custom-logo';
import Header from '../header/header';

function UpperPart(props) {
  const { currentStep, flow, currentComponent } = props;
  const { next } = currentComponent;

  const isLast = () => !next;

  return (
    <Grid container alignItems="center" justify="center" data-role="header" spacing={3}>
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
        <Grid item xs={12} md={2}>
          <CustomLogo condition="getIdLogo" />
        </Grid>
        {flow.length > 1 && (
        <ProgressBar
          isLast={isLast}
          flowLength={flow.length}
          activeStepParent={currentStep}
        />
        )}
      </Grid>
      <Header currentComponent={currentComponent} />
    </Grid>
  );
}

UpperPart.propTypes = {
  currentStep: PropTypes.number.isRequired,
  flow: PropTypes.array.isRequired,
  currentComponent: PropTypes.object.isRequired,
};

export default UpperPart;
