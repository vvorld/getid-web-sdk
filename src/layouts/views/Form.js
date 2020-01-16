import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import TextInput from '../../components/Inputs/TextInput';
import DateInput from '../../components/Inputs/DateInput';
import Select from '../../components/Inputs/Select';
import CustomCheckBox from '../../components/Inputs/Checkbox';
import CustomFileInput from '../../components/Inputs/FileInput';
import actions from '../../store/actions';
import { toBase64 } from '../../helpers/tree-builder';
import {getFormValues, getScanValues} from '../../store/selectors';

const styles = (theme) => ({
  labelCheckbox: {
    margin: '40px 0 0 0',
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

class Form extends Component {
  constructor(props) {
    super(props);
    const { formType, fields, currentStep } = this.props;
    this.fields = fields;
    this.currentStep = currentStep;
    this.gridWidth = formType === 'narrow' ? 6 : 12;
  }

  componentDidMount() {
    const {
      fields, addField, currentStep, fieldValues,
    } = this.props;

    const isFormFilledIn = fieldValues[currentStep];

    if (fields && !isFormFilledIn) {
      fields.forEach((field) => {
        addField(field.name, field.value, currentStep);
      });
    }
  }

  handleDateChange = (key) => (date) => {
    this.props.addField(key, date, this.currentStep, 'date');
  };

  handleFiles = async (event) => {
    const eventTarget = event.target;
    const file = [...event.target.files][0];
    const convertedFile = await toBase64(file);
    this.props.addScan(eventTarget.name, convertedFile);
    this.props.addField(eventTarget.name, file.name, this.currentStep);
  };

  handleChange = (event) => {
    const eventTarget = event.target;
    const value = eventTarget.type === 'checkbox' ? eventTarget.checked : eventTarget.value;
    this.props.addField(eventTarget.name, value, this.currentStep, eventTarget.type);
  };

  generateInputs() {
    const { fieldValues, classes } = this.props;

    return this.fields.map((field) => {
      if (field.type === 'select') {
        const { options } = field;

        return (
          <Grid item key={`select-${field.label}`} xs={11} sm={this.gridWidth}>
            <Select
              name={field.name}
              items={options}
              value={fieldValues[this.currentStep][field.name]}
              placeholder={field.placeholder}
              onChange={this.handleChange}
            />
          </Grid>
        );
      }

      if (field.type === 'file') {
        return (
          <Grid item key={`select-${field.label}`} xs={11} sm={this.gridWidth}>
            <CustomFileInput
              onChange={this.handleFiles}
              name={field.name}
              label={field.label}
              type={field.type}
              valueName={fieldValues[this.currentStep][field.name]}
            />
          </Grid>
        );
      }

      if (field.type === 'checkbox') {
        return (
          <Grid item key={`checkbox-grid-${field.label}`} xs={11} xl={12}>
            <Grid container justify="center">
              <Grid item xs={12} sm={10} md={10} lg={8}>
                <FormControlLabel
                  data-role="checkbox"
                  className={classes.labelCheckbox}
                  key={`control-${field.label}`}
                  control={(
                    <CustomCheckBox
                      data-role="checkboxInput"
                      name={field.name}
                      key={`checkbox-${field.label}`}
                      checked={fieldValues[this.currentStep][field.name]}
                      onChange={this.handleChange}
                      value={this.props[field.name]}
                    />
                  )}
                  label={<label className="label-checkbox">{parse(field.label)}</label>}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      }

      if (field.type === 'date') {
        return (
          <Grid item key={`dategrid-${field.label}`} xs={11} sm={this.gridWidth}>
            <DateInput
              key={`dateinput-${field.label}`}
              name={field.name}
              label={field.label}
              format="yyyy-MM-dd"
              value={fieldValues[this.currentStep][field.name] || null}
              onChange={this.handleDateChange(field.name)}
            />
          </Grid>
        );
      }

      return (
        <Grid item key={`text-${field.label}`} xs={11} sm={this.gridWidth}>
          <TextInput
            type={field.type}
            name={field.name}
            value={fieldValues[this.currentStep][field.name]}
            onChange={this.handleChange}
            label={field.label}
            key={`input-${field.label}`}
          />
        </Grid>
      );
    });
  }

  render() {
    const { fieldValues, currentStep } = this.props;

    if (fieldValues[currentStep]) {
      return (
        <Grid alignItems="center" justify="center" container spacing={2} data-role="blockForm">
          {this.generateInputs()}
        </Grid>
      );
    }

    return null;
  }
}

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  fieldValues: PropTypes.object.isRequired,
  addField: PropTypes.func.isRequired,
  addScan: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  classes: PropTypes.object,
};

Form.defaultProps = {
  classes: {},
};

const mapStateToProps = (state) => ({
  fieldValues: getFormValues(state),
});

export default connect(
  mapStateToProps,
  actions,
)(withStyles(styles)(Form));
