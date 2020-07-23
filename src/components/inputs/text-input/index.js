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
        variant="outlined"
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          },
        }}
        inputProps={{
          classes: {
            root: classes.root + classname,
          },
          autocomplete: 'off',
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
