import { fade, makeStyles } from '@material-ui/core';

const ErrorViewStyles = makeStyles((theme) => ({
  header: {
    color: theme.palette.blue,
    fontSize: '32px',
    letterSpacing: '0.192941px',
    lineHeight: '41px',
  },
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
  subHeader: {
    margin: '16px 8px 30px 8px',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '22px',
    color: theme.palette.blueDark,
    opacity: '0.7',
  },
  hr: {
    background: fade(theme.palette.violet, 0.5),
    border: '0',
    height: '1px',
    margin: '20px auto',
    width: '30px',
  },
  hrLong: {
    background: fade(theme.palette.violet, 0.5),
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: '1rem 0',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
}));

export default ErrorViewStyles;
