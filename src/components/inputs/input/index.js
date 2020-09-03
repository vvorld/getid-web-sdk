import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const defaultValidation = (value, isRequired) => {
  if (!value && isRequired) {
    return 'Value can not be empty';
  }
  return null;
};

const Input = ({
  name, label, value, onChange, required, validation,
}) => {
  const placeholder = label + (required ? '*' : '');
  const [currValue, setValue] = useState(value);
  const [error, setError] = useState(null);

  const validate = (checkValue) => {
    if (validation && typeof validation === 'function') {
      validation(checkValue, setError);
      return;
    }
    const errorMessage = defaultValidation(checkValue, required);
    setError(errorMessage);
  };

  useEffect(() => {
    if (currValue) {
      validate(currValue);
    }
    onChange(currValue, !!error);
  }, [currValue, error]);

  const changeVal = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  return (
    <div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        className={error && 'getid-input-error'}
        value={currValue}
        onChange={changeVal}
        key={`input-${label}`}
      />
      {error && <span className="getid-error__message">{error }</span>}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  validation: PropTypes.func,
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
