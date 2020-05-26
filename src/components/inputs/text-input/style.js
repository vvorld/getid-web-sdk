import { fade, makeStyles } from '@material-ui/core';

const customInputStyles = makeStyles((theme) => ({
  root: {
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
    '&.filled': {
      border: '1px solid rgba(120, 97, 162,1)',
    },
    '&$focused': {
      color: theme.palette.deepBlue,
      backgroundColor: theme.palette.white,
      borderColor: theme.palette.violet,
    },
  },
  labelRoot: {
    width: '95%',
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    textAlign: 'start',
    '&$labelFocused': {
      color: `${fade(theme.palette.deepBlue, 0.5)}`,
    },
  },
  focused: {},
  labelFocused: {},
}));

export default customInputStyles;
