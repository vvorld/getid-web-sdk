import { makeStyles } from '@material-ui/core';

const loader = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
  },
  top: {
    color: theme.palette.blueLight,
  },
  bottom: {
    color: theme.palette.violet,
    animationDuration: '850ms',
    position: 'absolute',
    left: 0,
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    position: 'absolute',
    top: '55%',
    left: 0,
    right: 0,
    margin: 'auto',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontSize: '22px',
    lineHeight: '100%',
    color: theme.palette.blueLoader,
  },
}));

export default loader;
