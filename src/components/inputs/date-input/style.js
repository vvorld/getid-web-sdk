import { makeStyles } from '@material-ui/core';

const datePickerStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.mainInput,
    // datepicker icon
    '& .MuiButtonBase-root': {
      padding: '3px',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  labelRoot: {
    ...theme.typography.label,
  },
}));

export default datePickerStyles;
