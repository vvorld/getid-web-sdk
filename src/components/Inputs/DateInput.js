import React from 'react';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';

const DatePickerTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#7861A2',
      },
    },
    'MuiPickersBasePicker-pickerView': {
      color: 'rgba(255, 255, 255, 0.54)',
    },
    MuiPickersYear: {
      root: {
        '&:focus': {
          color: '#7861A2',
        },
        color: '#7861A2',
      },
      yearSelected: {
        color: '#7861A2',
      },
    },
    MuiPickersMonth: {
      root: {
        '&:focus': {
          color: '#7861A2',
        },
        color: '#7861A2',
      },
      monthSelected: {
        color: '#7861A2',
      },
    },
    MuiPickersDay: {
      day: {
        '&:hover': {
          backgroundColor: '#7861A2!important',
          color: 'rgba(255, 255, 255, 0.54)!important',
        },
      },
      daySelected: {
        backgroundColor: '#7861A2',
        color: 'rgba(255, 255, 255, 0.54)!important',
        '&:hover': {
          backgroundColor: '#7861A2!important',
          color: 'rgba(255, 255, 255, 0.54)!important',
        },
      },
    },
  },
});

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
    '&$focused': {
      color: '#0E1C2C',
      backgroundColor: '#fff',
      borderColor: '#7861A2',
    },
    '&.filled': {
      border: '1px solid rgba(120, 97, 162,1)',
    },
  },
  labelRoot: {
    color: 'rgba(14, 28, 44, 0.5)',
    '&$labelFocused': {
      color: 'rgba(14, 28, 44, 0.5)',
    },
  },
  focused: {},
  labelFocused: {},
}));

function DateInput(props) {
  const classes = customInputStyles();
  const classname = props.value ? ' filled' : '';
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <ThemeProvider theme={DatePickerTheme}>
          <FormControl fullWidth>
            <DatePicker
              data-role="datePicker"
              openTo="date"
              inputVariant="filled"
              variant="inline"
              views={['year', 'month', 'date']}
              {...props}
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
            />
          </FormControl>
        </ThemeProvider>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

DateInput.propTypes = {
  value: PropTypes.any,
};

DateInput.defaultProps = {
  value: '',
};

export default DateInput;
