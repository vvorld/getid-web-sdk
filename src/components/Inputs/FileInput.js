import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import styles from '../../assets/jss/components/inputs/FileInput';

const CustomFileInput = (props) => {
  const {
    type, onChange, label, valueName, name,
  } = props;
  const classes = styles();
  const isValue = valueName;

  const borderClass = isValue ? `${classes.border} selected` : classes.border;
  const labelClass = isValue ? `${classes.label} selected` : classes.label;
  const inputClass = isValue ? `${classes.inputValue} selected` : classes.inputValue;

  return (
    <div className={borderClass}>
      <Button
        className={classes.outlinedInput}
        variant="outlined"
        component="label"
      >
                Browse file
        <input
          accept="image/x-png,image/jpeg"
          name={name}
          onChange={onChange}
          className={classes.outlinedInput}
          hidden
          type={type}
        />
      </Button>
      <div className={classes.labelContainer}>
        <input disabled value={valueName} className={inputClass} />
        <label className={labelClass}>
          { label }
        </label>
      </div>
    </div>
  );
};

CustomFileInput.propTypes = {
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  valueName: PropTypes.any,
};

CustomFileInput.defaultProps = {
  valueName: null,
};

export default CustomFileInput;
