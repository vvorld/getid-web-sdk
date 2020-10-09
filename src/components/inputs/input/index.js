import React from 'react';

const defaultValidation = (value, isRequired) => {
  if (!value && isRequired) {
    return 'Value can not be empty';
  }
  return null;
};

const Input = ({
  name, label, value, onChange, required, validation, mask, invalid, placeholder
}) => {
  const pl = placeholder + (required ? '*' : '');

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
  if (!!invalid !== !!error) {
    onChange(value, !!error);
  }

  return (
    <div>
      <label className="getid-form__input-label" data-role="input-label">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={pl}
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
  placeholder: '',
  onChange: () => {},
  required: false,
  validation: null,
};

export default Input;
