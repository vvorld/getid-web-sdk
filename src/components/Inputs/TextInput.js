import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';

const customInputStyles = makeStyles((theme) => ({
  root: {
    fontSize: '1rem',
    border: '1px solid rgba(120, 97, 162, 0.4)',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'transparent',
    width: '100%',
    color: '#0E1C2C',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#fff',
      color: '#0E1C2C',
    },
    '&.filled': {
      border: '1px solid rgba(120, 97, 162,1)',
    },
    '&$focused': {
      color: '#0E1C2C',
      backgroundColor: '#fff',
      borderColor: '#7861A2',
    },
  },
  labelRoot: {
    color: 'rgba(14, 28, 44, 0.5)',
    textAlign: 'start',
    '&$labelFocused': {
      color: 'rgba(14, 28, 44, 0.5)',
    },
  },
  focused: {},
  labelFocused: {},
}));

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
