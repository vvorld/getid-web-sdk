import React, { useState } from 'react';

const Input = ({
  name, label, value, onChange, required,
}) => {
  const placeholder = label + (required ? '*' : '');
  const [currValue, setValue] = useState(value);
  return (
    <div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        value={currValue}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
          setValue(newValue);
        }}
        key={`input-${label}`}
      />
    </div>
  );
};

export default Input;
