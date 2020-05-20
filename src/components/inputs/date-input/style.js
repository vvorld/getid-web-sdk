import { fade, makeStyles } from '@material-ui/core';

const datePickerStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      padding: '3px',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    fontSize: '1rem',
    border: `1px solid ${fade(theme.palette.violet, 0.5)}`,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'transparent',
    width: '100%',
    color: theme.palette.deepBlue,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: theme.palette.white,
      color: theme.palette.deepBlue,
    },
    '&$focused': {
      color: theme.palette.deepBlue,
      backgroundColor: theme.palette.white,
      borderColor: theme.palette.violet,
    },
    '&.filled': {
      border: `1px solid ${theme.palette.violet}`,
    },
  },
  labelRoot: {
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    '&$labelFocused': {
      color: `${fade(theme.palette.deepBlue, 0.5)}`,
    },
  },
  focused: {},
  labelFocused: {},
}));

export default datePickerStyles;
