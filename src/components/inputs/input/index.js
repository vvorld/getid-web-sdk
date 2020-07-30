import React, { useState, useEffect } from 'react';

const Input = ({
  name, label, value, onChange, required, validation,
}) => {
  const placeholder = label + (required ? '*' : '');
  const [currValue, setValue] = useState(value);
  const [error, setError] = useState(null);

  const validate = (checkValue) => {
    if (validation && typeof validation === 'function') {
      validation(checkValue, setError);
    }
  };

  useEffect(() => {
    validate(currValue);
  }, [currValue]);

  return (
    <div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        className={error && 'getid-error'}
        value={currValue}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
          setValue(newValue);
        }}
        key={`input-${label}`}
      />
      {error && <span className="getid-error__message">{error }</span>}
    </div>
  );
};

export default Input;
