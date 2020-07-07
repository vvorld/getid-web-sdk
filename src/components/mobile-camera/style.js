import { makeStyles } from '@material-ui/core';

const MobileCameraStyles = makeStyles(() => ({
  cameraWrapper: {
    background: 'black',
  },
  video: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: 'auto',
  },
  selfie: {
    transform: 'scale(-1, 1)',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    padding: '10px 0',
    background: 'black',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'block',
    width: '100vw',
  },
}));

export default MobileCameraStyles;
