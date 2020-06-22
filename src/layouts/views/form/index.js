import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FileInput, TextInput,
} from '../../../components/inputs';
import actions from '../../../store/actions';
import { getFormValues } from '../../../store/selectors';

class Form extends Component {
  constructor(props) {
    super(props);
    const {
      formType, fields, currentStep, currentComponent,
    } = this.props;
    this.fields = fields;
    this.currentStep = currentStep;
    const hundredYearsAgo = new Date();
    this.minDate = hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
    const narrow = 5 * currentComponent.component.length;
    const wide = 10;
    this.gridWidth = formType === 'narrow' ? narrow : wide;
    this.state = {
      errorText: {},
      isError: {},
    };
  }

  componentDidMount() {
    const {
      fields, addField, currentStep, fieldValues,
    } = this.props;

    const isFormFilledIn = fieldValues[currentStep];

    if (fields && !isFormFilledIn) {
      fields.forEach((field) => {
        const {
          name, value, required, type, hidden,
        } = field;
        addField(name, value, currentStep, required !== false, type, hidden);
      });
    }
  }

  handleDateChange = (key, isRequired) => (date) => {
    // temporary workaround because of @material-ui/pickers bug with format
    // issue: https://github.com/mui-org/material-ui-pickers/issues/1348
    if (Date.parse(date) < this.minDate) {
      this.props.addField(key, 'Invalid Date', this.currentStep, isRequired, 'date');
      return;
    }
    if (date) {
      const convertToUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      this.props.addField(key, convertToUTC, this.currentStep, isRequired, 'date');
    }
  };

  setErrorState = (isError, name, errorText) => {
    this.setState((prevState) => ({
      isError: {
        ...prevState.isError,
        [name]: isError,
      },
      errorText: {
        ...prevState.errorText,
        [name]: errorText,
      },
    }));
  }

  handleFiles = async (event) => {
    const eventTarget = event.target;
    const file = [...event.target.files][0];
    if (file && file.size / 1024 / 1024 > 6) {
      this.changeFileData(eventTarget, null);
      this.setErrorState(true, eventTarget.name, 'File size exceeded (max 6mb)');
      return;
    }
    this.changeFileData(eventTarget, file);
    this.setErrorState(false, eventTarget.name, '');
  };

  changeFileData = (eventTarget, file) => {
    this.props.addField(eventTarget.name,
      (file && file.name) || '',
      this.currentStep,
      eventTarget.required,
      eventTarget.type);

    this.props.addScan(eventTarget.name,
      file,
      this.currentStep,
      eventTarget.required);
  }

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
    const { isError, errorText } = this.state;
    const fileTooltip = translations.file_input_tooltip;

    return this.fields.map((field) => {
      const {
        options, type, name, label, placeholder, hidden, required,
      } = field;

      const inputName = name && fieldValues[this.currentStep][name];
      const wrapperClass = (isHidden) => `${classes.fieldWrapper} ${isHidden && classes.hidden}`;

      const isRequired = required !== false;
      if (type === 'select') {
        return (
          <div>
            <select
              name={name}
              items={options}
              required={isRequired}
              value={inputName.value}
              placeholder={placeholder}
              onChange={this.handleSelectChange(isRequired, type)}
            />
          </div>
        );
      }

      if (type === 'file') {
        return (
          <div>
            {fileTooltip}
            <FileInput
              isError={isError[name]}
              onChange={this.handleFiles}
              name={name}
              label={label}
              required={isRequired}
              type={type}
              valueName={inputName.value}
            />
            {isError[name] && errorText[name]}
          </div>
        );
      }

      if (type === 'checkbox') {
        return (
          <div>
            <label>
              <input
                type="checkbox"
                data-role="checkboxInput"
                name={name}
                key={`checkbox-${label}`}
                checked={inputName.value}
                onChange={this.handleChange}
                value={this.props[name]}
                required={isRequired}
              />
              {label}
            </label>
          </div>
        );
      }

      return (
        <div className={wrapperClass(hidden)} item key={`text-${label}`} xs={11} sm={9} md={this.gridWidth}>
          <TextInput
            type={type}
            name={name}
            required={isRequired}
            value={inputName.value}
            onChange={this.handleChange}
            label={label}
            key={`input-${label}`}
          />
        </div>
      );
    });
  }

  render() {
    const { fieldValues, currentStep } = this.props;

    if (fieldValues[currentStep]) {
      return (
        <div data-role="blockForm">
          {this.generateInputs()}
        </div>
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
)(Form);
