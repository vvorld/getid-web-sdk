import React, { useState, useEffect } from 'react';
import PropTypes, { instanceOf } from 'prop-types';

const defaultValidation = (value, isRequired) => {
  if (!value && isRequired) {
    return 'Value can not be empty';
  }
  return null;
};

const Input = ({
  name, label, value, onChange, required, validation, mask, ...other
}) => {
  const placeholder = label + (required ? '*' : '');

  const validate = () => {
    if (validation && typeof validation === 'function') {
      let err = null;
      validation(value, (e) => err = e);
      return err;
    }
    if (mask && mask.regexp) {
      const regex = new RegExp(mask.regexp);
      if (!regex.test(value)) {
        return mask.message || 'Error';
      }
      return null;
    }
    return defaultValidation(value, required);
  };

  const error = value ? validate(value) : null;
  const changeVal = (e) => {
    const newValue = e.target.value;
    onChange(newValue, !!validate(value));
  };

  return (
    <div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        className={error && 'getid-input-error'}
        value={value}
        onChange={changeVal}
        key={`input-${label}`}
      />
      {error && <span className="getid-error__message">{error }</span>}
    </div>
  );
};

Input.defaultProps = {
  name: '',
  label: '',
  value: '',
  onChange: () => {},
  required: false,
  validation: null,
};

export default Input;
