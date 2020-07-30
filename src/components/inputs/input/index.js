import React, { useState, useEffect } from 'react';

const Input = ({
  name, label, value, onChange, required,
}) => {
  const placeholder = label + (required ? '*' : '');
  const [currValue, setValue] = useState(value);
  const [error, setError] = useState(null);
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const validate = (checkValue) => {
    if (currValue && currValue.length !== 0 && !re.test(String(checkValue).toLowerCase())) {
      setError('Input is not valid');
      return;
    }
    setError(null);
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
