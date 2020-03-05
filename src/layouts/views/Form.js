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
import { getFormValues } from '../../store/selectors';

const styles = (theme) => ({
  hidden: {
    display: 'none',
  },
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
        const required = field.required === false ? field.required : true;
        addField(field.name, field.value, currentStep, required, field.type);
      });
    }
  }

  handleDateChange = (key, isRequired) => (date) => {
    this.props.addField(key, date, this.currentStep, isRequired, 'date');
  };

  handleFiles = async (event) => {
    const eventTarget = event.target;
    const file = [...event.target.files][0];
    this.props.addField(eventTarget.name,
      file.name,
      this.currentStep,
      eventTarget.required,
      eventTarget.type);

    this.props.addScan(eventTarget.name,
      file,
      this.currentStep,
      eventTarget.required);
  };

  handleChange = (event) => {
    const eventTarget = event.target;
    const value = eventTarget.type === 'checkbox' ? eventTarget.checked : eventTarget.value;

    this.props.addField(eventTarget.name,
      value,
      this.currentStep,
      eventTarget.required,
      eventTarget.type);
  };

  handleSelectChange = (isRequired, type) => (event) => {
    const eventTarget = event.target;
    const { value } = eventTarget;

    this.props.addField(eventTarget.name,
      value,
      this.currentStep,
      isRequired,
      type);
  };

  generateInputs() {
    const {
      fieldValues, classes, translations,
    } = this.props;
    const fileTooltip = translations.file_input_tooltip;
    return this.fields.map((field) => {
      const {
        options, type, name, label, placeholder, hidden,
      } = field;

      const inputName = fieldValues[this.currentStep][name];

      const required = field.required === false ? field.required : true;
      if (type === 'select') {
        return (
          <Grid className={hidden && classes.hidden} item key={`select-${label}`} xs={11} sm={9} md={this.gridWidth}>
            <Select
              name={name}
              items={options}
              required={required}
              value={inputName.value}
              placeholder={placeholder}
              onChange={this.handleSelectChange(required, type)}
            />
          </Grid>
        );
      }

      if (type === 'file') {
        return (
          <Grid className={hidden && classes.hidden} item key={`select-${label}`} xs={11} sm={9} md={this.gridWidth}>
            {fileTooltip && <FormHelperText className={classes.helper} id="component-helper-text">{fileTooltip}</FormHelperText>}
            <CustomFileInput
              onChange={this.handleFiles}
              name={name}
              label={label}
              required={required}
              type={type}
              valueName={inputName.value}
            />
          </Grid>
        );
      }

      if (type === 'checkbox') {
        return (
          <Grid className={hidden && classes.hidden} item key={`checkbox-grid-${label}`} xs={11} sm={9} xl={12}>
            <Grid container justify="center">
              <Grid item xs={12} sm={10} md={10} lg={8}>
                <FormControlLabel
                  data-role="checkbox"
                  className={classes.labelCheckbox}
                  key={`control-${label}`}
                  control={(
                    <CustomCheckBox
                      data-role="checkboxInput"
                      name={name}
                      key={`checkbox-${label}`}
                      checked={inputName.value}
                      onChange={this.handleChange}
                      value={this.props[name]}
                      required={required}
                    />
                  )}
                  label={<label className="label-checkbox">{parse(label)}</label>}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      }

      if (type === 'date') {
        return (
          <Grid className={hidden && classes.hidden} item key={`dategrid-${label}`} xs={11} sm={9} md={this.gridWidth}>
            <DateInput
              key={`dateinput-${label}`}
              name={name}
              minDate={this.minDate}
              required={required}
              label={label}
              format="yyyy-MM-dd"
              value={inputName.value || null}
              onChange={this.handleDateChange(name, required)}
            />
          </Grid>
        );
      }

      return (
        <Grid className={hidden && classes.hidden} item key={`text-${label}`} xs={11} sm={9} md={this.gridWidth}>
          <TextInput
            type={type}
            name={name}
            required={required}
            value={inputName.value}
            onChange={this.handleChange}
            label={label}
            key={`input-${label}`}
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
