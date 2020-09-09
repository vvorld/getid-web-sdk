import React, { useState } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import './style.css';

function Checkbox(props) {
  const { label, onChange, value, required } = props;
  const [currValue, setValue] = useState(value);
  return (
    <label
      className="getid-checkbox__label"
      data-role="checkbox"
      key={`control-${label}`}
    >
      <input
        checked={currValue}
        type="checkbox"
        onChange={
          (e) => {
            const newValue = e.target.checked;
            const invalid = required && newValue === false;
            onChange(newValue, invalid);
            setValue(newValue);
          }
        }
      />
      <span className="getid-checkbox__input" />
      <span>
        {parse(label)}
      </span>
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
};

Checkbox.defaultProps = {
  label: '',
  value: false,
  onChange: () => {},
};

export default Checkbox;
