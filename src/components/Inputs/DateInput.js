import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import { Icon } from '@material-ui/core';
import datePickerStyles from '../../assets/jss/components/inputs/DatePicker';
import calendar from '../../assets/icons/calendar.svg';

function DateInput(props) {
  const classes = datePickerStyles();
  const classname = props.value ? ' filled' : '';

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <FormControl fullWidth>
          <KeyboardDatePicker
            data-role="datePicker"
            openTo="date"
            autoOk
            inputVariant="filled"
            variant="inline"
            disableFuture
            keyboardIcon={(
              <Icon className={classes.iconStyle}>
                <img alt="calendar" src={calendar} />
              </Icon>
            )}
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
