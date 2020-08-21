import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import { Icon } from '@material-ui/core';
import datePickerStyles from './style';

const CalendarIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <path fillRule="evenodd" clipRule="evenodd" d="M19.1543 2.46094H18.5391V1.8457C18.5391 0.827982 17.7111 0 16.6934 0C15.6756 0 14.8477 0.827982 14.8477 1.8457V2.46094H6.15234V1.8457C6.15234 0.827982 5.32436 0 4.30664 0C3.28892 0 2.46094 0.827982 2.46094 1.8457V2.46094H1.8457C0.827982 2.46094 0 3.28892 0 4.30664V19.1543C0 20.172 0.827982 21 1.8457 21H19.1543C20.172 21 21 20.172 21 19.1543V4.30664C21 3.28892 20.172 2.46094 19.1543 2.46094ZM16.0781 1.8457C16.0781 1.50646 16.3541 1.23047 16.6934 1.23047C17.0326 1.23047 17.3086 1.50646 17.3086 1.8457V4.30664C17.3086 4.64588 17.0326 4.92188 16.6934 4.92188C16.3541 4.92188 16.0781 4.64588 16.0781 4.30664V1.8457ZM4.30664 1.23047C3.9674 1.23047 3.69141 1.50646 3.69141 1.8457V4.30664C3.69141 4.64588 3.9674 4.92188 4.30664 4.92188C4.64588 4.92188 4.92188 4.64588 4.92188 4.30664V1.8457C4.92188 1.50646 4.64588 1.23047 4.30664 1.23047ZM19.7695 19.1543C19.7695 19.4935 19.4935 19.7695 19.1543 19.7695H1.8457C1.50646 19.7695 1.23047 19.4935 1.23047 19.1543V8.69531H19.7695V19.1543ZM1.23047 7.46484H19.7695V4.30664C19.7695 3.9674 19.4935 3.69141 19.1543 3.69141H18.5391V4.30664C18.5391 5.32436 17.7111 6.15234 16.6934 6.15234C15.6756 6.15234 14.8477 5.32436 14.8477 4.30664V3.69141H6.15234V4.30664C6.15234 5.32436 5.32436 6.15234 4.30664 6.15234C3.28892 6.15234 2.46094 5.32436 2.46094 4.30664V3.69141H1.8457C1.50646 3.69141 1.23047 3.9674 1.23047 4.30664V7.46484Z" fill="#7861A2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.5 10H6.5C6.77613 10 7 10.2239 7 10.5V12.5C7 12.7761 6.77613 13 6.5 13H4.5C4.22387 13 4 12.7761 4 12.5V10.5C4 10.2239 4.22387 10 4.5 10ZM5 12H6V11H5V12Z" fill="#7861A2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.5 15H6.5C6.77613 15 7 15.2239 7 15.5V17.5C7 17.7761 6.77613 18 6.5 18H4.5C4.22387 18 4 17.7761 4 17.5V15.5C4 15.2239 4.22387 15 4.5 15ZM5 17H6V16H5V17Z" fill="#7861A2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.5 15H11.5C11.7761 15 12 15.2239 12 15.5V17.5C12 17.7761 11.7761 18 11.5 18H9.5C9.22387 18 9 17.7761 9 17.5V15.5C9 15.2239 9.22387 15 9.5 15ZM10 17H11V16H10V17Z" fill="#7861A2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.5 10H11.5C11.7761 10 12 10.2239 12 10.5V12.5C12 12.7761 11.7761 13 11.5 13H9.5C9.22387 13 9 12.7761 9 12.5V10.5C9 10.2239 9.22387 10 9.5 10ZM10 12H11V11H10V12Z" fill="#7861A2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.5 10H16.5C16.7761 10 17 10.2239 17 10.5V12.5C17 12.7761 16.7761 13 16.5 13H14.5C14.2239 13 14 12.7761 14 12.5V10.5C14 10.2239 14.2239 10 14.5 10ZM15 12H16V11H15V12Z" fill="#7861A2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.5 15H16.5C16.7761 15 17 15.2239 17 15.5V17.5C17 17.7761 16.7761 18 16.5 18H14.5C14.2239 18 14 17.7761 14 17.5V15.5C14 15.2239 14.2239 15 14.5 15ZM15 17H16V16H15V17Z" fill="#7861A2" />
    </g>
  </svg>
);

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
            inputVariant="outlined"
            variant="inline"
            disableFuture
            keyboardIcon={(
              <Icon className={classes.icon }>
                <CalendarIcon />
              </Icon>
            )}
            views={['year', 'month', 'date']}
            {...props}
            InputLabelProps={{
              classes: { root: classes.labelRoot },
            }}
            inputProps={{
              autocomplete: 'off',
              classes: { root: classes.root + classname },
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
