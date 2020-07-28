import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Radiobutton = (props) => (
  <label
    data-role={`radiogroup-${props.value}`}
    key={`label-${props.value}`}
    className={`getid-radio-input${props.checked ? ' getid-checked' : ''}`}
    {...props}
  >
    <input
      onChange={props.onChange}
      checked={props.checked}
      type="radio"
      data-role="radioBtn"
      key={`radio-${props.value}`}
    />
    {props.name}
  </label>
);

Radiobutton.propTypes = {
  value: PropTypes.any,
  checked: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

Radiobutton.defaultProps = {
  value: null,
  name: '',
  checked: false,
  onChange: () => {},
};

export default Radiobutton;
