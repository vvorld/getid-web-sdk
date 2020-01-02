import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomCheckBox from '../../components/Inputs/Checkbox';
import actions from '../../store/actions';
import { getFormValues } from '../../store/selectors';


class Consent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touLink: 'https://getid.ee/sdk-terms-of-use/',
      ppLink: 'https://getid.ee/sdk-privacy-policy/',
    };
  }

  handleChange = (event) => {
    const { currentStep } = this.props;
    this.props.addField('consent', event.target.checked, currentStep);
  };

  render() {
    const { currentStep, fieldValues } = this.props;
    const { touLink, ppLink } = this.state;

    return (
      <Grid container justify="center" data-role="blockConsent">
        <Grid item xs={12} sm={10} md={10} lg={8}>
          <FormControlLabel
            style={{ textAlign: 'left', marginLeft: 0, marginTop: '60px' }}
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
              <label className="label-checkbox" data-role="textConsent">
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
};

Consent.defaultProps = {
  addField: null,
  consent: false,
  fieldValues: {
    consent: false,
  },
};

const mapStateToProps = (state) => ({ fieldValues: getFormValues(state) });

export default connect(
  mapStateToProps,
  actions,
)(Consent);
