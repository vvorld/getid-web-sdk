import { fade, makeStyles } from '@material-ui/core';

const style = makeStyles((theme) => ({
  outlinedInput: {
    border: 'none',
    lineHeight: 'normal',
    padding: '14px 9px',
    color: theme.palette.blueDark,
    marginRight: '10px',
    fontSize: '14px',
    backgroundColor: theme.palette.lightViolet,
    borderRadius: '5px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.violet,
      color: theme.palette.white,
    },
  },
  border: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    flexDirection: 'row-reverse',
    backgroundColor: 'transparent',
    color: theme.palette.deepBlue,
    width: '100%',
    height: 56,
    border: `1px solid ${fade(theme.palette.violet, 0.5)}`,
    '&.selected': {
      border: `1px solid ${fade(theme.palette.violet, 1)}`,
    },
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  inputValue: {
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    fontSize: '16px',
    lineHeight: '22px',
    paddingLeft: '10px',
    '&.selected': {
      color: theme.palette.deepBlue,
      transformOrigin: 'center left',
      transform: 'translate(3px, -1px)',
    },
  },
  label: {
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    fontSize: '16px',
    lineHeight: '22px',
    paddingLeft: '10px',
    '&.selected': {
      transformOrigin: 'top left',
      transform: 'translate(3px, -2px) scale(0.75)',
      transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms',
    },
  },
}));

export default style;
