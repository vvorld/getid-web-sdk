import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import CustomLogo from '../components/Logo/CustomLogo';
import colors from '../assets/theme';
import TranslationsContext from '../context/TranslationsContext';

const { palette } = colors;

const useStyles = makeStyles(() => ({
  header: {
    color: palette.blue,
    fontSize: '26px',
    letterSpacing: '0.192941px',
    lineHeight: '41px',
    margin: '0',
  },
  subHeader: {
    margin: '16px 8px 30px 8px',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '22px',
    color: palette.blueDark,
    opacity: '0.7',
  },
  hr: {
    background: fade(palette.violet, 0.5),
    border: '0',
    height: '1px',
    margin: '20px auto',
    width: '30px',
  },
}));

function UpperPart(props) {
  const { currentStep, flow, currentComponent } = props;

  const { translations } = useContext(TranslationsContext);

  const isLast = () => currentComponent.next === null;

  const isConsent = () => currentComponent.name === 'Consent' && currentComponent.name;
  const isThankYou = () => currentComponent.name === 'ThankYou' && currentComponent.name;

  const isCondition = () => (isConsent() || isThankYou());

  const classes = useStyles();

  return (
    <Grid container alignItems="center" justify="center" data-role="header">
      <Grid item xs={10} sm={9} md={9}>
        {flow.length > 1 && (
          <Grid container alignItems="center" justify="center">
            <Grid item xs={12} sm={12} md={10}>
              <ProgressBar
                isLast={isLast}
                flowLength={flow.length}
                activeStepParent={currentStep}
              />
            </Grid>
          </Grid>
        )}
        <CustomLogo condition={isCondition()} />
        <h3 data-role="componentTitle" className={classes.header}>
          {' '}
          { translations[`${currentComponent.name}_header`]}
        </h3>
        <hr className={classes.hr} />
        <h5 className={classes.subHeader} px={1}>
          {translations[`${currentComponent.name}_subHeader`]}
        </h5>
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
