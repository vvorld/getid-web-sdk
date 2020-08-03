import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputRenderer } from '../../components/inputs';
import Footer from '../../components/blocks/footer/footer';
import './form.css';
import Header from '../../components/blocks/header/header';

class Form extends Component {
  constructor(props) {
    super(props);
    this.form = {};
  }

   handleChange = (name, type, value) => {
     this.form[name] = value;
   };

   render() {
     const { fields, finishStep, prevStep, componentName } = this.props;
     return (
       <>
         <Header componentName={componentName} />
         <form className="getid-form__body" data-role="blockForm">
           { fields.map((field) => (
             <div key={field.name} className="getid-form__input-wrapper">
               <InputRenderer {...field} onChange={this.handleChange} />
             </div>
           )) }
         </form>
         <Footer
           next={{ onClick: () => finishStep(this.form) }}
           back={{ onClick: prevStep }}
         />
       </>
     );
   }
}

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  translations: PropTypes.object.isRequired,
  finishStep: PropTypes.func,
  prevStep: PropTypes.func,
};

Form.defaultProps = {
  finishStep: null,
  prevStep: null,
};

export default Form;
