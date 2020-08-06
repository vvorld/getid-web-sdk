import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputRenderer } from '../../components/inputs';
import Footer from '../../components/blocks/footer/footer';
import Content from '../../components/blocks/content';

import './form.css';
import Header from '../../components/blocks/header/header';

const extractedData = [{ category: 'Country', content: 'EST', contentType: 'country' }, { category: 'Document number', content: 'BC0001651', contentType: 'string' }, { category: 'Date of expiry', content: '2023-06-25', contentType: 'date' }, { category: 'Date of issue', content: '2018-06-28', contentType: 'date' }, { category: 'Last name', content: 'KOCHEVATOV', contentType: 'string' }, { category: 'First name', content: 'GENNADY', contentType: 'string' }, { category: 'Surname and given names', content: 'KOCHEVATOV GENNADY', contentType: 'string' }, { category: 'Issuing state name', content: 'Estonia', contentType: 'string' }, { category: 'Place of issue', content: 'ELAMISLUBA TÖÖTAMISEKS', contentType: 'string' }, { category: 'Card access number', content: '267096', contentType: 'string' }, { category: 'Special notes', content: 'RESIDENCE PERMIT FOR EMPLOYMENT KUNI / UNTIL 25.06.2023', contentType: 'string' }, { category: 'Document type', content: 'residence-permit', contentType: 'string' }, { category: 'Issue country', content: 'EST', contentType: 'country' }];
class Form extends Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.state = {
      disabled: false,
    };
  }

  componentDidMount() {
    this.preFillForm(this.props.additionalData);
    this.preFillForm(this.props.fields);
  }

  preFillForm = (fields) => {
    fields.forEach((el) => {
      this.form[el.name] = { value: el.value, required: (el.required || el.type === 'consent') || false };
    });
    this.setState({ disabled: this.isDisabled() });
  }

  handleChange = (name, type, value, required) => {
    this.form[name] = { value, required };
    this.setState({ disabled: this.isDisabled() });
  };

  isDisabled = () => Object.values(this.form).some((el) => !el.value && el.required)

  getExtractedValue = (name) => {
    const extractedValue = (n) => extractedData.find((el) => el.category === n);
    return extractedValue(name);
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
