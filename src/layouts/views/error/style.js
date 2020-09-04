import { fade, makeStyles } from '@material-ui/core';

const ErrorViewStyles = makeStyles((theme) => ({
  centerBlock: {
    fontFamily: theme.typography.fontFamily,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '100vh',
  },
  item: {
    textAlign: 'center',
    position: 'relative',
  },
  hr: {
    background: fade(theme.palette.violet.dark, 0.5),
    border: '0',
    height: '1px',
    margin: '20px auto',
    width: '30px',
  },
  hrLong: {
    background: fade(theme.palette.violet.dark, 0.5),
    border: '0',
    height: '1px',
    margin: '20px auto',
    width: '100%',
  },
  marginAuto: {
    margin: '0 auto',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: '1rem 0',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
}));

export default ErrorViewStyles;
