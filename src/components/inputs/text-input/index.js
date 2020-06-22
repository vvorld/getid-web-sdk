import React from 'react';
import PropTypes from 'prop-types';

function CustomInput(props) {
  const { type } = props;

  return (
    <input
      data-role={`textField_${type}`}
      variant="outlined"
      {...props}
    />
  );
}

CustomInput.propTypes = {
  value: PropTypes.any,
  type: PropTypes.any,
};

CustomInput.defaultProps = {
  value: '',
  type: '',
};

export default CustomInput;
