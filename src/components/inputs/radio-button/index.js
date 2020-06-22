import React from 'react';
import PropTypes from 'prop-types';

const Radiobutton = (props) => {
  const classname = (props.selectedvalue === props.value ? ' selectedVal' : '');

  return (
    <label
      data-role={`radiogroup-${props.value}`}
      key={`label-${props.value}`}
      className={classname}
      labelPlacement="start"
      {...props}
    >
      <input
        type="radio"
        data-role="radioBtn"
        key={`radio-${props.value}`}
      />
      {props.value}
    </label>
  );
};

Radiobutton.propTypes = {
  value: PropTypes.any,
  selectedvalue: PropTypes.string,
};

Radiobutton.defaultProps = {
  value: null,
  selectedvalue: null,
};

export default Radiobutton;
