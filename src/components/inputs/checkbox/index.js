import React, { useState } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import css from './style.css';

function Checkbox(props) {
  const { label, onChange, value } = props;
  const [currValue, setValue] = useState(value);
  return (
    <label
      className={css.consent}
      data-role="checkbox"
      key={`control-${label}`}
    >
      <input
        checked={currValue}
        className={css.checkbox}
        type="checkbox"
        onChange={
          (e) => {
            const newValue = e.target.checked;
            onChange(newValue);
            setValue(newValue);
          }
        }

      />
      <span className={css.text}>
        {parse(label)}
      </span>
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string,
};

Checkbox.defaultProps = {
  label: '',
};

export default Checkbox;
