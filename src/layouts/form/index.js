import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputRenderer } from '../../components/inputs';
import Footer from '../../components/blocks/footer/footer';
import Content from '../../components/blocks/content';

import './form.css';
import Header from '../../components/blocks/header/header';

class Form extends Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.state = {
      disabled: false,
    };
  }

  componentDidMount() {
    this.props.additionalData.forEach((el) => {
      this.form[el.name] = { value: el.value, required: (el.required || el.type === 'consent') || false };
    });
    this.props.fields.forEach((el) => {
      this.form[el.name] = { value: el.value || this.getExtractedValue(el.name), required: (el.required || el.type === 'consent') || false };
    });
    this.setState({ disabled: this.isDisabled() });
  }

  handleChange = (name, type, value, required) => {
    this.form[name] = { value, required };
    this.setState({ disabled: this.isDisabled() });
  };

  isDisabled = () => Object.values(this.form).some((el) => !el.value && el.required)

  getExtractedValue = (name) => {
    const extractedData = this.props.extractedData || [];
    const extractedField = extractedData.find((el) => el.category === name);
    return extractedField && extractedField.content;
  }

  render() {
    const {
      fields, finishStep, prevStep,
    } = this.props;

    return (
      <>
        <Header componentName="Form" />
        <Content>
          <form className="getid-form__body " data-role="blockForm">
            {fields.map((field) => (
              <div key={field.name} className="getid-form__input-wrapper">
                <InputRenderer
                  value={field.value || this.getExtractedValue(field.name)}
                  required={(field.required || field.type === 'consent') || false}
                  {...field}
                  onChange={this.handleChange}
                />
              </div>
            ))}
          </form>
        </Content>
        <Footer
          next={{ onClick: () => finishStep(this.form), disable: this.state.disabled }}
          back={{ onClick: prevStep }}
        />
      </>
    );
  }
}

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  additionalData: PropTypes.array,
  componentName: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
  finishStep: PropTypes.func,
  prevStep: PropTypes.func,
};

Form.defaultProps = {
  finishStep: null,
  prevStep: null,
  additionalData: [],
};

export default Form;
