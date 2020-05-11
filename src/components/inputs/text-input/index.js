import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import PropTypes from 'prop-types';
import customInputStyles from './style';

function CustomInput(props) {
  const classes = customInputStyles();
  const classname = props.value ? ' filled' : '';
  const { type } = props;

  return (
    <FormControl fullWidth>
      <TextField
        data-role={`textField_${type}`}
        variant="filled"
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
            focused: classes.labelFocused,
          },
        }}
        InputProps={{
          classes: {
            root: classes.root + classname,
            focused: classes.focused,
          },
          disableUnderline: true,
        }}
        {...props}
      />
    </FormControl>
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
