import { fade, makeStyles } from '@material-ui/core';

const RadioButtonStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent!important',
    },
  },
  icon: {
    borderRadius: '8px',
    width: 25,
    height: 25,
    border: `1px solid ${fade(theme.palette.violet.main, 0.5)}`,
    'input:hover ~ &': {
      boxShadow: 'none',
    },
  },
  checkedIcon: {
    background: theme.palette.violet.main,
    '&:before': {
      display: 'block',
      backgroundRepeat: 'no-repeat',
      height: 25,
      backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath"
                + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 "
                + "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
  },
  label: {
    justifyContent: 'space-between',
    ...theme.typography.label,
    ...theme.inputBorder,
    margin: '10px 0 5px',
    padding: '4px 0',
    '&.MuiFormControlLabel-root > .MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1': {
      paddingLeft: 15,
    },
  },
  checked: {},
}));

export default RadioButtonStyles;
