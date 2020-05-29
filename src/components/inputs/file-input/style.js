import { fade, makeStyles } from '@material-ui/core';

const style = makeStyles((theme) => ({
  outlinedInput: {
    border: 'none',
    color: theme.palette.blue.dark,
    marginRight: '8px',
    backgroundColor: theme.palette.lightViolet,
    borderRadius: '5px',
    '&:hover': {
      '& .icon': {
        stroke: theme.palette.white,
      },
      backgroundColor: theme.palette.violet.main,
    },
    '& .icon': {
      stroke: theme.palette.violet.main,
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
    border: `1px solid ${fade(theme.palette.violet.main, 0.5)}`,
    '&.selected': {
      border: `1px solid ${fade(theme.palette.violet.main, 1)}`,
    },
    '&.error': {
      border: `1px solid ${fade(theme.palette.error.main, 1)}`,
    },
  },
  labelContainer: {
    paddingLeft: '5px',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  inputValue: {
    width: '100%',
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    fontSize: '16px',
    textAlign: 'left',
    lineHeight: '16px',
    display: 'none',
    zIndex: -1,
    '&.selected': {
      border: 'none',
      outline: 'none',
      display: 'block',
      color: theme.palette.deepBlue,
      transformOrigin: 'center left',
      transform: 'translate(3px, -1px)',
    },
  },
  label: {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    textAlign: 'left',
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    fontSize: '16px',
    lineHeight: '16px',
    paddingLeft: '5px',
    '&.selected': {
      paddingLeft: '5px',
      transformOrigin: 'top left',
      textAlign: 'start',
      transform: ' scale(0.75)',
      transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms',
    },
  },
}));

export default style;
