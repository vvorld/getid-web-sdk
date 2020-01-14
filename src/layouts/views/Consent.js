import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomCheckBox from '../../components/Inputs/Checkbox';
import actions from '../../store/actions';
import { getFormValues } from '../../store/selectors';
import getidLogo from '../../assets/icons/getid-small.svg';
import onfidoLogo from '../../assets/icons/onfido.svg';

const useStyles = (theme) => ({
  poweredBlock: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
    '&& img': {
      margin: '0 11px',
    },
  },
  poweredLabel: {
    fontSize: '15px',
    lineHeight: '22px',
    color: '#173D69',
    opacity: 0.3,
  },
  slash: {
    opacity: 0.1,
    width: '1px',
    margin: '0 3px',
    background: '#000000',
  },
  labelCheckbox: {
    color: theme.palette.blueDark,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '22px',
    textAlign: 'left',
    '& a': {
      color: theme.palette.violet,
    },
  },
});

class Consent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touLink: 'https://getid.ee/sdk-terms-of-use/',
      ppLink: 'https://getid.ee/sdk-privacy-policy/',
    };
  }

  componentDidMount() {
    const {
      addField, currentStep, fieldValues,
    } = this.props;
    if (!fieldValues[currentStep]) {
      addField('consent', false, currentStep);
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
    const { touLink, ppLink } = this.state;

    return (
      <Grid container alignItems="center" justify="center" data-role="blockConsent">
        <Grid item xs={11} sm={10} md={10} lg={8}>
          {showOnfidoLogo && (
            <div className={classes.poweredBlock}>
              <span className={classes.poweredLabel}>Powered by</span>
              <img src={getidLogo} alt="getid" data-role="getidLogo" />
              <div className={classes.slash} />
              <img src={onfidoLogo} alt="onfido" data-role="onfidoLogo" />
            </div>
          )}

          { fieldValues[currentStep] && (
          <FormControlLabel
            className={classes.labelCheckbox}
            control={(
              <CustomCheckBox
                data-role="checkboxConsent"
                name="consent"
                key="checkbox-consent"
                checked={fieldValues[currentStep].consent}
                onChange={this.handleChange}
                value={fieldValues[currentStep].consent}
              />
            )}
            label={(
              <label data-role="textConsent">
                I have read and understand or I have read and understood
                {' '}
                <a href={touLink} data-role="linkTerms" rel="noopener noreferrer" target="_blank">Terms of use</a>
                {' '}
                and
                {' '}
                <a href={ppLink} data-role="linkPolicy" rel="noopener noreferrer" target="_blank">Privacy policy</a>
                {' '}
                of GetID OÜ.
              </label>
            )}
          />
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

export default connect(
  mapStateToProps,
  actions,
)(withStyles(useStyles)(Consent));
