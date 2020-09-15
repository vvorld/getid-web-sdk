import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputRenderer } from '~/components/inputs';
import Footer from '~/components/blocks/footer';
import Content from '~/components/blocks/content';

import './form.css';
import Header from '~/components/blocks/header/header';

class Form extends Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.state = {
      disabled: false,
    };
  }

  componentWillMount() {
    const getFormValue = ({ name, value, type }) => {
      const f = (this.props.form || {})[name];
      if (f && f.value) {
        return f.value;
      }
      if (value) {
        return value;
      }
      const extValue = this.getExtractedValue(name);
      if (extValue) {
        return extValue;
      }
      if (type === 'consent' || type === 'checkbox') {
        return false;
      }
      return '';
    };

    this.props.additionalData.forEach((el) => {
      this.form[el.name] = {
        value: getFormValue(el),
        required: (el.required || el.type === 'consent') || false,
      };
    });

    this.props.fields.forEach((el) => {
      this.form[el.name] = {
        value: getFormValue(el),
        required: (el.required || el.type === 'consent') || false,
      };
    });

    this.setState({ disabled: this.isDisabled() });
  }

  handleChange = (name, type, value, required, invalid) => {
    this.form[name] = { value, required, invalid };
    this.setState({ disabled: this.isDisabled() });
  };

  isDisabled = () => Object
    .values(this.form)
    .some((el) => (el.invalid ? el.invalid : (!el.value && el.required)))

  getExtractedValue = (name) => {
    const { extractedData } = this.props;
    if (!extractedData) {
      return null;
    }
    const extractedField = extractedData.find((el) => el.category === name);
    return extractedField && extractedField.content;
  }

  copyForm = () => ({ ...this.form })

  render() {
    const {
      fields, finishStep, prevStep,
    } = this.props;

    return (
      <>
        <Header step="Form" />
        <Content step="Form">
          <form className="getid-form__body " data-role="blockForm">
            {fields.map((field) => (
              <div key={field.name} className="getid-form__input-wrapper">
                <InputRenderer
                  {...field}
                  value={this.form[field.name].value}
                  required={(field.required || field.type === 'consent') || false}
                  onChange={this.handleChange}
                />
              </div>
            ))}
          </form>
        </Content>
        <Footer
          step="Form"
          next={{ onClick: () => finishStep(this.copyForm()), disable: this.state.disabled }}
          back={{ onClick: prevStep }}
        />
      </>
    );
  }
}
Form.propTypes = {
  finishStep: PropTypes.func,
  prevStep: PropTypes.func,
  additionalData: PropTypes.array,
  fields: PropTypes.array,
  extractedData: PropTypes.array,
  form: PropTypes.array,
};
Form.defaultProps = {
  finishStep: null,
  prevStep: null,
  form: null,
  additionalData: [],
  fields: [],
  extractedData: [],
};

export default Form;
