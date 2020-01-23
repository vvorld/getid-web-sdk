import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import CustomCheckBox from '../../components/Inputs/Checkbox';
import actions from '../../store/actions';
import { getFormValues } from '../../store/selectors';
import TranslationsContext from '../../context/TranslationsContext';
import getidLogo from '../../assets/icons/getid-small.svg';
import onfidoLogo from '../../assets/icons/onfido.svg';
import consentStyles from '../../assets/jss/views/Consent';

class Consent extends Component {
  componentDidMount() {
    const {
      addField, currentStep, fieldValues,
    } = this.props;
    if (!fieldValues[currentStep]) {
      addField('consent', false, currentStep, true);
    }
  }

  handleChange = (event) => {
    const { currentStep } = this.props;
    this.props.addField('consent', event.target.checked, currentStep);
  };

  render() {
    const {
      currentStep,
      fieldValues,
      classes,
      showOnfidoLogo,
    } = this.props;
    const { translations } = this.context;

    return (
      <Grid container alignItems="center" justify="center" data-role="blockConsent">
        <Grid item xs={11} sm={8} md={8} lg={8}>
          {showOnfidoLogo && (
            <div className={classes.poweredBlock}>
              <span className={classes.poweredLabel}>Powered by</span>
              <img src={getidLogo} alt="getid" data-role="getidLogo" />
              <div className={classes.slash} />
              <img src={onfidoLogo} alt="onfido" data-role="onfidoLogo" />
            </div>
          )}

          { fieldValues[currentStep] && (
          <div className={classes.consentBLock}>
            <FormControlLabel
              className={classes.labelCheckbox}
              control={(
                <CustomCheckBox
                  data-role="checkboxConsent"
                  name="consent"
                  key="checkbox-consent"
                  checked={fieldValues[currentStep].consent.value}
                  onChange={this.handleChange}
                  value={fieldValues[currentStep].consent.value}
                />
                    )}
              label={(
                <label data-role="textConsent">
                  { parse(translations.consent) }
                </label>
                    )}
            />
          </div>
          )}
        </Grid>
      </Grid>
    );
  }
}

Consent.propTypes = {
  addField: PropTypes.func,
  consent: PropTypes.any,
  currentStep: PropTypes.number.isRequired,
  fieldValues: PropTypes.shape({
    consent: PropTypes.any,
  }),
  showOnfidoLogo: PropTypes.bool,
  classes: PropTypes.object,
};

Consent.defaultProps = {
  addField: null,
  consent: false,
  fieldValues: {
    consent: false,
  },
  showOnfidoLogo: false,
  classes: {},
};

const mapStateToProps = (state) => ({ fieldValues: getFormValues(state) });
Consent.contextType = TranslationsContext;

export default connect(
  mapStateToProps,
  actions,
)(withStyles(consentStyles)(Consent));
