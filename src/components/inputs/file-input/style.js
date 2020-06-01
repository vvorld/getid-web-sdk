import { makeStyles } from '@material-ui/core';

const style = makeStyles((theme) => ({
  uploadFile: {
    marginRight: '8px',
    backgroundColor: theme.palette.violet.light,
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: theme.palette.violet.dark,
      '& .icon > path, line': {
        stroke: theme.palette.white,
      },
    },
  },
  inputWrapper: {
    ...theme.inputBorder,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    backgroundColor: 'transparent',
    width: '100%',
    height: 56,
  },
  labelContainer: {
    width: '100%',
    paddingLeft: '5px',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  inputValue: {
    // paddingLeft: '5px',
    ...theme.typography.mainInput,
    width: '95%!important',
    display: 'none',
    zIndex: -1,
    '&.selected': {
      border: 'none',
      outline: 'none',
      display: 'block',
      ...theme.typography.mainInput,
      transformOrigin: 'center left',
      transform: 'translate(3px, 0px)',
    },
  },
  label: {
    ...theme.typography.main,
    ...theme.typography.label,
    paddingLeft: '8px',
    '&.selected': {
      width: 'auto',
      position: 'absolute',
      paddingRight: '5px',
      color: theme.palette.violet.main,
      transformOrigin: 'top left',
      textAlign: 'start',
      transform: 'translate(2px, -29px) scale(0.75)',
      transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    },
  },
}));

export default style;
