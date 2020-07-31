import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
        {options.map(({ name, val }) => <option key={name} value={val}>{name}</option>)}
      </select>
    </>
  );
};

Select.propTypes = {
  options: PropTypes.shape([]),
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

Select.defaultProps = {
  options: [],
  label: '',
  value: '',
  placeholder: '',
  required: false,
  onChange: null,
};

export default Select;
