import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { connect } from 'react-redux';
import {
  withStyles, FormHelperText, FormControlLabel, Grid,
} from '@material-ui/core';
import TextInput from '../../components/Inputs/TextInput';
import DateInput from '../../components/Inputs/DateInput';
import Select from '../../components/Inputs/Select';
import CustomCheckBox from '../../components/Inputs/Checkbox';
import CustomFileInput from '../../components/Inputs/FileInput';
import actions from '../../store/actions';
import { toBase64 } from '../../helpers/tree-builder';
import { getFormValues } from '../../store/selectors';

const styles = (theme) => ({
  labelCheckbox: {
    margin: '40px 0 0 0',
    textAlign: 'left',
    '& label': {
      color: theme.palette.blueDark,
      lineHeight: '22px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '15px',
    },
    '& a': {
      color: theme.palette.violet,
    },
  },
  helper: {
    marginBottom: '10px',
    marginTop: '4px',
    color: theme.palette.blueDark,
    opacity: '0.7',
  },
});

class Form extends Component {
  constructor(props) {
    super(props);
    const {
      formType, fields, currentStep, currentComponent,
    } = this.props;
    this.fields = fields;
    this.currentStep = currentStep;
    const narrow = 5 * currentComponent.component.length;
    const wide = 10;
    this.gridWidth = formType === 'narrow' ? narrow : wide;
  }

  componentDidMount() {
    const {
      fields, addField, currentStep, fieldValues,
    } = this.props;

    const isFormFilledIn = fieldValues[currentStep];

    if (fields && !isFormFilledIn) {
      fields.forEach((field) => {
        addField(field.name, field.value, currentStep, (field.required || false));
      });
    }
  }

  handleDateChange = (key, isRequired) => (date) => {
    this.props.addField(key, date, this.currentStep, 'date', isRequired);
  };

  handleFiles = async (event) => {
    const eventTarget = event.target;
    const file = [...event.target.files][0];
    const convertedFile = await toBase64(file);
    this.props.addScan(eventTarget.name, convertedFile);
    this.props.addField(eventTarget.name, file.name, this.currentStep, eventTarget.required);
  };

  handleChange = (event) => {
    const eventTarget = event.target;
    const value = eventTarget.type === 'checkbox' ? eventTarget.checked : eventTarget.value;

    this.props.addField(eventTarget.name,
      value,
      this.currentStep,
      eventTarget.required);
  };

  handleSelectChange = (isRequired) => (event) => {
    const eventTarget = event.target;
    const { value } = eventTarget;

    this.props.addField(eventTarget.name,
      value,
      this.currentStep,
      isRequired);
  };

  generateInputs() {
    const { fieldValues, classes, translations } = this.props;
    const fileTooltip = translations.file_input_tooltip;
    return this.fields.map((field) => {
      if (field.type === 'select') {
        const { options } = field;

        return (
          <Grid item key={`select-${field.label}`} xs={11} sm={9} md={this.gridWidth}>
            <Select
              name={field.name}
              items={options}
              required={field.required}
              value={fieldValues[this.currentStep][field.name].value}
              placeholder={field.placeholder}
              onChange={this.handleSelectChange(field.required)}
            />
          </Grid>
        );
      }

      if (field.type === 'file') {
        return (
          <Grid item key={`select-${field.label}`} xs={11} sm={9} md={this.gridWidth}>
            {fileTooltip && <FormHelperText className={classes.helper} id="component-helper-text">{fileTooltip}</FormHelperText>}
            <CustomFileInput
              onChange={this.handleFiles}
              name={field.name}
              label={field.label}
              required={field.required}
              type={field.type}
              valueName={fieldValues[this.currentStep][field.name].value}
            />
          </Grid>
        );
      }

      if (field.type === 'checkbox') {
        return (
          <Grid item key={`checkbox-grid-${field.label}`} xs={11} sm={9} xl={12}>
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
                      checked={fieldValues[this.currentStep][field.name].value}
                      onChange={this.handleChange}
                      value={this.props[field.name]}
                      required={field.required}
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
          <Grid item key={`dategrid-${field.label}`} xs={11} sm={9} md={this.gridWidth}>
            <DateInput
              key={`dateinput-${field.label}`}
              name={field.name}
              required={field.required}
              label={field.label}
              format="yyyy-MM-dd"
              value={fieldValues[this.currentStep][field.name].value || null}
              onChange={this.handleDateChange(field.name, field.required)}
            />
          </Grid>
        );
      }

      return (
        <Grid item key={`text-${field.label}`} xs={11} sm={9} md={this.gridWidth}>
          <TextInput
            type={field.type}
            name={field.name}
            required={field.required}
            value={fieldValues[this.currentStep][field.name].value}
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
        <Grid alignItems="flex-end" justify="center" container spacing={2} data-role="blockForm">
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
  translations: PropTypes.object.isRequired,
  addField: PropTypes.func.isRequired,
  addScan: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  currentComponent: PropTypes.object.isRequired,
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
