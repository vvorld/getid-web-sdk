import { makeStyles } from '@material-ui/styles';

const cameraStyles = makeStyles((theme) => ({
  cameraDisabled: {
    boxSizing: 'border-box',
    background: theme.palette.blue,
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
  imgOverlay: {
    bottom: '10px',
    position: 'absolute',
    right: '10px',
  },
  stuff: {
    border: '1px solid #ccc',
    display: 'inline-block',
    padding: '6px 12px',
    cursor: 'pointer',
  },
}));

export default cameraStyles;
