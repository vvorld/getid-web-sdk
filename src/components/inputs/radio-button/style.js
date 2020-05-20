import { fade, makeStyles } from '@material-ui/core';

const RadioButtonStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent!important',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 29,
    height: 29,
    border: `1px solid ${fade(theme.palette.violet, 0.5)}`,
    'input:hover ~ &': {
      boxShadow: 'none',
    },
  },
  checkedIcon: {
    background: `linear-gradient(46.87deg, ${theme.palette.aqua} -57.75%, ${theme.palette.crimson} 193.27%)`,
    '&:before': {
      display: 'block',
      height: 29,
      backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath"
                + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 "
                + "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
  },
  label: {
    justifyContent: 'space-between',
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    borderRadius: 8,
    margin: '10px 0 5px',
    padding: '4px 0',
    border: `1px solid ${fade(theme.palette.violet, 0.5)}`,
    '&.MuiFormControlLabel-root > .MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1': {
      paddingLeft: 15,
    },
    '&.selectedVal': {
      border: '1px solid #7861A2',
      color: theme.palette.deepBlue,
    },
  },
  checked: {},
}));

export default RadioButtonStyles;
