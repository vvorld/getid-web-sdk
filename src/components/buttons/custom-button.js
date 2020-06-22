import React from 'react';
import PropTypes from 'prop-types';

const CustomButton = ({ args }) => {
  const {
    type,
    text,
    hidden,
    disabled,
    action,
  } = args;

  return (
    <div>
      <button
        data-role={`btn_${type}`}
        className={hidden ? ' hidden' : ''}
        onClick={action}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

CustomButton.propTypes = {
  args: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    iconItem: PropTypes.node,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    action: PropTypes.func,
    variant: PropTypes.string,
    direction: PropTypes.string,
    width: PropTypes.number,
  }),
};

CustomButton.defaultProps = {
  args: {
    text: '',
    type: '',
    iconItem: '',
    hidden: false,
    disabled: false,
    action: () => {},
    variant: '',
    direction: '',
    width: 12,
  },
};

export default CustomButton;
