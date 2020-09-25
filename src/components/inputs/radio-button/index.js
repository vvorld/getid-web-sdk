import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Radiobutton = (props) => (
  <label
    htmlFor={props.name}
    data-role="radio-btn-label"
    key={`label-${props.value}`}
    className="getid-radio-button__label"
    {...props}
  >
    <input
      onChange={props.onChange}
      checked={props.checked && 'checked'}
      type="radio"
      id={props.name}
      data-role="radio-btn-input"
      key={`radio-${props.value}`}
    />
    <span data-role="radio-btn-span" className="getid-radio-button__input" />
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
