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
    this.props.fields.forEach((el) => {
      this.form[el.name] = { value: el.value, required: el.required || el.name === 'privacy' };
    });
    this.setState({ disabled: this.isDisabled() });
  }

  handleChange = (name, type, value, required) => {
    this.form[name] = { value, required };
    this.setState({ disabled: this.isDisabled() });
  };

  isDisabled = () => Object.values(this.form).some((el) => !el.value && el.required)

  render() {
    const {
      fields, finishStep, prevStep, componentName,
    } = this.props;

    return (
      <>
        <Header componentName={componentName} />
        <Content>
          <form className="getid-form__body " data-role="blockForm">
            {fields.map((field) => (
              <div key={field.name} className="getid-form__input-wrapper">
                <InputRenderer {...field} onChange={this.handleChange} />
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
  componentName: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
  finishStep: PropTypes.func,
  prevStep: PropTypes.func,
};

Form.defaultProps = {
  finishStep: null,
  prevStep: null,
};

export default Form;
