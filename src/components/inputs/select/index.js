import React, { useState } from 'react';

const Select = (props) => {
  const {
    options, label, value, placeholder, required, onChange,
  } = props;
  const [currValue, setValue] = useState(value || '');
  const pl = placeholder + (required ? '*' : '');
  return (
    <>
      {label && <label className="getid-form__input-label">{label + (required ? '*' : '')}</label>}
      <select
        value={currValue}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          onChange(v);
        }}
      >
        <option value="">
          {pl}
        </option>
        {options.map(({ name, value }) => <option key={name} value={value}>{name}</option>)}
      </select>
    </>
  );
};

export default Select;
