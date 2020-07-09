import { makeStyles } from '@material-ui/styles';

const cameraStyles = makeStyles((theme) => ({
  cameraDisabled: {
    boxSizing: 'border-box',
    background: theme.palette.blue.main,
    padding: '80px 0',
    '&& img': {
      marginBottom: '22px',
    },
    '&& div': {
      color: theme.palette.white,
      fontSize: '15px',
      lineHeight: '22px',
      textAlign: 'center',
    },
  },
  mediaWrapper: {
    margin: '0 auto',
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
  },
  video: {
    transform: 'scale(-1.145, 1.145)',
  },
  cameraOverlay: {
    width: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
  },
}));

export default cameraStyles;
