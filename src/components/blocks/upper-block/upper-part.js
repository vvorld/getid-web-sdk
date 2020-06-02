import React from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import ProgressBar from '../flow-progression/progress-bar/progress-bar';
import CustomLogo from '../../logo/custom-logo';
import Header from '../header/header';

function UpperPart() {
  const flow = useSelector((state) => state.sdkFlow);
  const currentStep = useSelector((state) => state.step);
  const currentComponent = flow[currentStep];
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

export default UpperPart;
