import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputRenderer,
} from '../../components/inputs';
import Footer from '../../components/blocks/footer/footer';
import './form.css';

class Form extends Component {
  constructor(props) {
    super(props);
    this.form = {};
  }

   handleChange = (name, type, value) => {
     this.form[name] = value;
   };

   render() {
     const { fields, finishStep, prevStep } = this.props;
     return (
       <>
         <form className="getid-form__body" data-role="blockForm">
           { fields.map((field) => (
             <div className="getid-form__input-wrapper">
               <InputRenderer {...field} onChange={this.handleChange} />
             </div>
           )) }
         </form>
         <Footer
           next={() => finishStep(this.form)}
           back={prevStep}
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
