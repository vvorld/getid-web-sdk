import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

function CustomCheckbox(props) {
  return (
    <label
      data-role="checkbox"
      key={`control-${props.label}`}
    >
      <input
        type="checkbox"
        {...props}
      />
      {parse(props.label)}
    </label>
  );
}

CustomCheckbox.propTypes = {
  label: PropTypes.string,
};

CustomCheckbox.defaultProps = {
  label: '',
};

export default CustomCheckbox;
