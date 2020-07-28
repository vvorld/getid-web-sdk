import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputRenderer,
} from '../../components/inputs';
import Footer from '../../components/blocks/footer/footer';
import './form.css';

class Form extends Component {
  /*
  handleDateChange = (key, isRequired) => (date) => {
    const convertToUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    this.props.addField(key, convertToUTC, this.currentStep, isRequired, 'date');
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

  handleSelectChange = (isRequired, type) => (event) => {
    const eventTarget = event.target;
    const { value } = eventTarget;

    this.props.addField(eventTarget.name,
      value,
      this.currentStep,
      isRequired,
      type);
  }; */

   handleChange = (value, type, name) => {
     /* const eventTarget = event.target;
     const value = eventTarget.type === 'checkbox' ? eventTarget.checked : eventTarget.value;
     this.props.addField(eventTarget.name,
       value,
       this.currentStep,
       eventTarget.required,
       eventTarget.type); */
   };

   render() {
     const { fields, actions } = this.props;
     return (
       <>
         <form className="getid-form__body" data-role="blockForm">
           { fields.map((field) => (
             <div className="getid-form__input-wrapper">
               <InputRenderer {...field} />
             </div>
           )) }
         </form>
         <Footer
           disable
           next={actions.nextStep}
           back={actions.prevStep}
         />
       </>
     );
   }
}

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  translations: PropTypes.object.isRequired,
  addField: PropTypes.func.isRequired,
  addScan: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default Form;
