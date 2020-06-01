import React from 'react';
import { IconButton, InputLabel } from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './style';

const Upload = () => (
  <svg className="icon" width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.125 8.25H17C18.1046 8.25 19 9.14543 19 10.25V16.25C19 17.3546 18.1046 18.25 17 18.25H3C1.89543 18.25 1 17.3546 1 16.25V8.25C1 7.14543 1.89543 6.25 3 6.25H4.31431C4.98394 6.25 5.60915 6.58513 5.97986 7.14278L6.12241 7.35722C6.49313 7.91487 7.11833 8.25 7.78797 8.25H8.875" stroke="#7861A2" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12.5" y1="11.5" x2="12.5" y2="2.5" stroke="#7861A2" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15.1805 4.18198L12.499 1.50049L9.81753 4.18198" stroke="#7861A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CustomFileInput = (props) => {
  const {
    type, onChange, label, valueName, name, required, isError,
  } = props;
  const classes = styles();
  const isValue = valueName;

  const customLabel = required ? `${label}\u2009*` : label;

  const borderClass = isValue ? `${classes.inputWrapper} selected` : classes.inputWrapper;
  const labelClass = isValue ? `${classes.label} selected` : classes.label;
  const inputClass = isValue ? `${classes.inputValue} selected` : classes.inputValue;


  return (
    <div className={borderClass + (isError ? ' error' : '')}>
      <IconButton
        className={classes.uploadFile}
        variant="outlined"
        component="label"
      >
        <Upload />
        <input
          accept="image/x-png,image/jpeg"
          name={name}
          onChange={onChange}
          className={classes.outlinedInput}
          hidden
          type={type}
        />
      </IconButton>
      <div className={classes.labelContainer}>
        <input disabled value={valueName || ''} className={inputClass} />
        <InputLabel className={labelClass}>
          { customLabel }
        </InputLabel>
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
  required: PropTypes.bool,
  isError: PropTypes.bool,
};

CustomFileInput.defaultProps = {
  valueName: null,
  required: false,
  isError: false,
};

export default CustomFileInput;
