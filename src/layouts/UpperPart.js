import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import CustomLogo from '../components/Logo/CustomLogo';
import messages from '../messages/messages';

const useStyles = makeStyles((theme) => ({
  topPart: {
    marginTop: '188px',
    [theme.breakpoints.down('md')]: {
      marginTop: '90px',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: '30px',
    },
  },
  header: {
    marginTop: 0,
    color: theme.palette.blue,
    fontSize: theme.typography.mainHeaderSize,
    letterSpacing: '0.192941px',
    lineHeight: '41px',
  },
  subHeader: {
    margin: '0 8px 30px 8px',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '22px',
    color: theme.palette.blueDark,
    opacity: '0.7',
    [theme.breakpoints.down('sm')]: {
      marginTop: '13px',
    },
  },
  hr: {
    background: fade(theme.palette.violet, 0.5),
    border: '0',
    height: '1px',
    margin: '0 auto 40px',
    width: '30px',
  },
}));

function UpperPart(props) {
  const { currentStep, flow, currentComponent } = props;

  const isLast = () => currentComponent.next === null;

  const isThankYou = () => currentComponent.name === 'ThankYou' && currentComponent.name;
  const isConsent = () => currentComponent.name === 'Consent' && currentComponent.name;

  const classes = useStyles();

  return (
    <Grid container alignItems="center" justify="center" data-role="header" spacing={3}>
      {flow.length > 1 && (
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
        <Grid item xs={12} md={2} className={classes.item}>
          <CustomLogo condition="getIdLogo" />
        </Grid>
        <Grid alignItems="flex-end" item xs={12} md={8}>
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
        <Grid item xs={10} md={4}>
          {!isConsent() && (
          <h3
            data-role="componentTitle"
            className={classes.header}
          >
            {messages.header[currentComponent.name]}
          </h3>
          )}
          <hr className={classes.hr} />
          { !isConsent() && (
          <h5 className={classes.subHeader}>
            {messages.subHeader[currentComponent.name]}
          </h5>
          ) }
          <CustomLogo text="Powered By " condition={(isConsent() || isThankYou())} />
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
